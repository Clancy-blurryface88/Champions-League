import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { User, UserStats, Match, Prediction, GeneralQuestion, GeneralPrediction } from "@/api/entities";
import { Settings, LogOut, PlayCircle, Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatchesByDateSheet from "./components/MatchesByDateSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import LeaderboardPanel from "./components/LeaderboardPanel";
import WelcomeModal from "./components/WelcomeModal";
import GeneralPredictionsOnboarding from "./components/GeneralPredictionsOnboarding";
import IntroVideoModal from "./components/IntroVideoModal";
import ExactHitsPanel from "./components/ExactHitsPanel";
// This import is kept as per outline
import { createPageUrl } from "@/utils";
import { LoaderBar } from "./components/ui/LoaderBar";
import AppBackground from "./components/AppBackground";
import { TOURNAMENT_CODE } from "@/config/tournament";
import LiveDataPanel from "./components/LiveDataPanel"; // Added: Import LiveDataPanel
import MatchTickerBar from "./components/MatchTickerBar";
import YearlySummaryPanel from "./components/YearlySummaryPanel"; // NEW: YearlySummaryPanel
import { OdometerDigit } from "./components/OdometerScore";
import TeamFlag from "./components/TeamFlag";
import LiveLeaderboard from "./components/LiveLeaderboard";
import FinalResultsOverlay from "./components/FinalResultsOverlay";

// Measures a ref'd element's rendered box size, updating on resize (the live
// card's width is responsive — min(370px, 92vw) — so the ring's actual
// dimensions aren't known ahead of render).
function localDayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// Where a ray from the box's center at `angleDeg` (0° = top, clockwise —
// matching CSS conic-gradient's own angle convention) exits a rounded
// rectangle of the given half-width/half-height/corner-radius. This is what
// lets the minute chip ride exactly on the ring's visual edge instead of
// tracing a plain circle that doesn't match the card's actual rounded-rect
// shape.
function roundedRectEdgePoint(angleDeg, halfW, halfH, r) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  if (halfW <= 0 || halfH <= 0) return { x: 0, y: 0 };
  const rr = Math.min(r, halfW, halfH);

  if (Math.abs(dx) < 1e-6) return { x: 0, y: dy > 0 ? halfH : -halfH };
  if (Math.abs(dy) < 1e-6) return { x: dx > 0 ? halfW : -halfW, y: 0 };

  const signX = dx > 0 ? 1 : -1;
  const signY = dy > 0 ? 1 : -1;

  // Straight vertical edge (x = ±halfW)
  {
    const t = (signX * halfW) / dx;
    const y = dy * t;
    if (Math.abs(y) <= halfH - rr) return { x: signX * halfW, y };
  }
  // Straight horizontal edge (y = ±halfH)
  {
    const t = (signY * halfH) / dy;
    const x = dx * t;
    if (Math.abs(x) <= halfW - rr) return { x, y: signY * halfH };
  }
  // Rounded corner — nearest circle centered at (±(halfW-rr), ±(halfH-rr))
  const cx = signX * (halfW - rr);
  const cy = signY * (halfH - rr);
  const B = -2 * (dx * cx + dy * cy);
  const C = cx * cx + cy * cy - rr * rr;
  const disc = Math.max(B * B - 4 * C, 0);
  const t = (-B + Math.sqrt(disc)) / 2;
  return { x: dx * t, y: dy * t };
}

// Real, continuously-live match progress (0→1 over a 90-minute match).
// Anchors to the API's own `minute` whenever it provides one (accounts for
// stoppage time, delayed kickoffs, etc. — far more accurate than assuming
// elapsed-since-scheduled-kickoff), then extrapolates smoothly every second
// between polls, re-anchoring (self-correcting) every time a fresh poll comes
// in. Only falls back to a naive elapsed-since-kickoff estimate when the API
// genuinely has no minute for this match. Eases in from 0 on first mount.
function useLiveMinuteProgress(liveMatch) {
  const [progress, setProgress] = useState(0);
  // Increments each time the ring finishes "catching up" to the real minute
  // (first mount, or after re-anchoring on a fresh poll) — lets the UI flash
  // the minute number right as the ring settles into place.
  const [settledTick, setSettledTick] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!liveMatch) { setProgress(0); return; }
    const anchorAt = Date.now();
    const anchorMinute = liveMatch.minute != null
      ? liveMatch.minute
      : (liveMatch.utcDate ? Math.max(0, (anchorAt - new Date(liveMatch.utcDate).getTime()) / 60000) : 0);
    const compute = () => Math.max(0, Math.min((anchorMinute + (Date.now() - anchorAt) / 60000) / 90, 1));

    let raf, iv;
    const beginLiveTicking = () => {
      setProgress(compute());
      iv = setInterval(() => setProgress(compute()), 1000);
    };

    if (!startedRef.current) {
      startedRef.current = true;
      const target = compute();
      const revealDuration = 2200;
      // Anchor the reveal's t=0 to the first rAF callback's own timestamp,
      // not to a performance.now() read beforehand — any delay between
      // scheduling this effect and the browser's next paint (Layout mounts a
      // lot at once) would otherwise already eat into revealDuration before
      // the first frame ever renders, making the ring appear to "jump" to
      // its target instead of visibly filling from empty.
      setProgress(0);
      let revealStart = null;
      const tick = (now) => {
        if (revealStart === null) revealStart = now;
        const p = Math.min((now - revealStart) / revealDuration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
        else {
          beginLiveTicking();
          setSettledTick((t) => t + 1);
        }
      };
      raf = requestAnimationFrame(tick);
    } else {
      beginLiveTicking();
      setSettledTick((t) => t + 1);
    }

    return () => { if (raf) cancelAnimationFrame(raf); if (iv) clearInterval(iv); };
  }, [liveMatch]);

  return { progress, settledTick };
}

// The live-match intro card: sized/margined like the Next Match card (never
// touches the screen edges on narrow phones), ringed by a conic-gradient
// border that fills clockwise from the top according to the match minute
// (out of 90), with its content flipping in on a 3D Y-axis. No layoutId here
// — sharing it with the small corner LIVE chip made framer-motion interpolate
// their very different border-radii and left the chip looking squared-off.
function LiveMatchCard({ liveMatch, liveUserPrediction, compact = false, centeredWidth = false }) {
  const { progress, settledTick } = useLiveMinuteProgress(liveMatch);
  const minute = liveMatch ? Math.floor(progress * 90) : null;
  const homeScore = Math.min(Math.max(Number(liveMatch?.score?.fullTime?.home ?? 0) || 0, 0), 9);
  const awayScore = Math.min(Math.max(Number(liveMatch?.score?.fullTime?.away ?? 0) || 0, 0), 9);
  // Hold the digits at 0 until the ring finishes its reveal — the roll to the
  // real score then plays right as/after the minute settles into place,
  // instead of racing ahead on its own fixed timer.
  const displayHomeScore = settledTick > 0 ? homeScore : 0;
  const displayAwayScore = settledTick > 0 ? awayScore : 0;

  const RING_RADIUS = compact ? 13 : 20;
  const ringRef = useRef(null);
  const ringSize = useElementSize(ringRef);
  const marker = roundedRectEdgePoint(progress * 360, ringSize.width / 2, ringSize.height / 2, RING_RADIUS);
  const digitScale = compact ? 0.36 : 0.8;

  return (
    <motion.div
      ref={ringRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{
        scale: 0.15, x: '38vw', y: '-42vh', opacity: 0,
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      className={compact ? "rounded-xl" : "rounded-2xl"}
      style={{
        position: 'relative',
        padding: compact ? 1.5 : 2.5,
        borderRadius: RING_RADIUS,
        maxWidth: compact ? (centeredWidth ? 'calc(50% - 6px)' : '100%') : 'min(370px, 92vw)',
        background: `conic-gradient(from 0deg, #ef4444 ${progress * 360}deg, rgba(255,255,255,0.08) ${progress * 360}deg 360deg)`,
        boxShadow: compact ? '0 0 14px rgba(239,68,68,0.18)' : '0 0 30px rgba(239,68,68,0.2)',
      }}
    >
      {minute != null && ringSize.width > 0 && (
        <motion.div
          key={settledTick}
          animate={settledTick > 0 ? { scale: [1, 1.5, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ringSize.width / 2 + marker.x,
            top: ringSize.height / 2 + marker.y,
            transform: 'translate(-50%, -50%)',
            background: '#7cadee', color: '#000', fontWeight: 900, fontSize: compact ? 8 : 11,
            borderRadius: 999, padding: compact ? '1px 4px' : '2px 7px', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a',
            zIndex: 5,
          }}
        >
          {minute}'
        </motion.div>
      )}
      <div
        className={compact ? "rounded-xl" : "rounded-2xl"}
        style={{
          background: 'rgba(8,18,32,0.95)',
          backdropFilter: 'blur(28px)',
          boxShadow: compact ? '0 0 24px rgba(239,68,68,0.14), 0 8px 24px rgba(0,0,0,0.6)' : '0 0 60px rgba(239,68,68,0.18), 0 20px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
            <div className={compact ? "px-2 py-2.5 flex flex-col items-center gap-1.5" : "px-6 py-6 flex flex-col items-center gap-4"}>
              <div className={compact ? "flex items-center gap-1 px-1.5 py-0.5 rounded-full" : "flex items-center gap-2 px-3 py-1 rounded-full"} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <span className={compact ? "relative flex h-1.5 w-1.5 flex-shrink-0" : "relative flex h-2.5 w-2.5 flex-shrink-0"}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className={compact ? "relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" : "relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"} />
                </span>
                <span className={compact ? "text-red-400 text-[8px] font-bold tracking-widest uppercase" : "text-red-400 text-xs font-bold tracking-widest uppercase"}>Live</span>
              </div>
              {liveMatch && (
                <div className="flex flex-col items-center gap-1">
                  {/* Flags flank the score directly, vertically centered on the digits (the
                      team-code label is absolutely positioned so it doesn't push the flag
                      itself up relative to the shorter digit boxes) */}
                  <div className={compact ? "flex items-center gap-1" : "flex items-center gap-3"} dir="ltr">
                    <div className="relative flex flex-col items-center">
                      <TeamFlag logo={liveMatch.homeTeam?.crest} name={liveMatch.homeTeam?.name} className={compact ? "w-6 h-6" : "w-12 h-12"} animate={false} />
                      {!compact && <span className="absolute top-full mt-1 text-slate-400 text-[10px] whitespace-nowrap">{liveMatch.homeTeam?.tla}</span>}
                    </div>
                    <div style={{ width: compact ? 15 : 34, height: compact ? 23 : 50, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <div style={{ transform: `scale(${digitScale})`, transformOrigin: 'top left', width: 42, height: 64 }}>
                        <OdometerDigit target={displayHomeScore} delayMs={150} />
                      </div>
                    </div>
                    <span style={{ color: '#475569', fontSize: compact ? 15 : 34, fontWeight: 900 }}>-</span>
                    <div style={{ width: compact ? 15 : 34, height: compact ? 23 : 50, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <div style={{ transform: `scale(${digitScale})`, transformOrigin: 'top left', width: 42, height: 64 }}>
                        <OdometerDigit target={displayAwayScore} delayMs={400} />
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <TeamFlag logo={liveMatch.awayTeam?.crest} name={liveMatch.awayTeam?.name} className={compact ? "w-6 h-6" : "w-12 h-12"} animate={false} />
                      {!compact && <span className="absolute top-full mt-1 text-slate-400 text-[10px] whitespace-nowrap">{liveMatch.awayTeam?.tla}</span>}
                    </div>
                  </div>
                  {liveUserPrediction && (
                    <div className={compact ? "flex flex-col items-center gap-0.5 mt-0.5" : "flex flex-col items-center gap-1 mt-2"}>
                      {!compact && <span className="text-slate-400 text-xs">הניחוש שלי</span>}
                      <span className={compact ? "text-sky-400 text-[8px] font-bold" : "text-sky-400 text-sm font-bold"} dir="ltr">
                        ({liveUserPrediction.predicted_score_a} - {liveUserPrediction.predicted_score_b})
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// When several matches are live at once, each gets its own full ring+minute+
// odometer card (same LiveMatchCard as the single-match case) — but they
// don't all pop in together. Each is only revealed once the previous one's
// own minute-ring + score reveal has fully played out, so it reads as
// "match 1 finishes filling in, then match 2 appears, then match 3...".
// This mirrors LiveMatchCard/useLiveMinuteProgress's own reveal choreography:
// the ring fills over 2200ms, then settledTick flips and the score digits
// start rolling — the later one (away, delayMs=400) finishes 400ms + the
// 1.4s roll (see OdometerDigit) after that. ~4000ms covers the full sequence.
const REVEAL_STEP_MS = 4000;

function LiveMatchesGrid({ liveMatches, liveUserPredictions, compact = false }) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
    if (liveMatches.length <= 1) return;
    let shown = 1;
    const iv = setInterval(() => {
      shown += 1;
      setVisibleCount(shown);
      if (shown >= liveMatches.length) clearInterval(iv);
    }, REVEAL_STEP_MS);
    return () => clearInterval(iv);
  }, [liveMatches.length]);

  if (liveMatches.length === 0) {
    return <LiveMatchCard liveMatch={null} liveUserPrediction={null} />;
  }

  return (
    <motion.div
      layout
      className={compact ? "grid gap-3 justify-items-stretch" : "flex flex-col items-center gap-4"}
      style={{
        ...(compact ? { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', width: 'min(560px, 94vw)' } : {}),
        maxHeight: '86vh',
        overflowY: 'auto',
        // The minute chip rides ON the ring's edge (half poking outside the
        // card's own box — see the marker math above), so clipping X here
        // was cutting it off whenever its swept position landed on the
        // ring's left/right edge during the reveal. Visible + generous
        // padding gives it room; vertical scrolling (for many stacked
        // matches) still works since that only needs overflowY.
        overflowX: 'visible',
        pointerEvents: 'auto',
        padding: 16,
      }}
    >
      <AnimatePresence>
        {liveMatches.slice(0, visibleCount).map((m, idx) => {
          // An odd match count leaves a lone card on the final row — instead
          // of it stretching to the row's full width, span both columns and
          // center it at a normal single-column width so it reads as a
          // deliberate centered card, not a stray half-empty row.
          const isLastOdd = compact && liveMatches.length % 2 === 1 && idx === liveMatches.length - 1;
          return (
            <div key={m.id} style={isLastOdd ? { gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' } : undefined}>
              <LiveMatchCard liveMatch={m} liveUserPrediction={liveUserPredictions[m.id] || null} compact={compact} centeredWidth={isLastOdd} />
            </div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

// The small chip that normally sits alone in the top-right corner
// ("🔴 [crest] 3-0 [crest] +N"), reused per-match — same visual, same size,
// no ring/odometer — so long-pressing it can list every live match as an
// identical little row instead of opening the big intro card.
function MiniLiveMatchChip({ match }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2.5 rounded-full"
      style={{
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.45)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <div className="flex items-center gap-1" dir="ltr">
        {match.homeTeam?.crest && (
          <img src={match.homeTeam.crest} className="w-3.5 h-3.5 object-contain" alt="" />
        )}
        <span className="text-white text-[11px] font-bold">
          {match.score?.fullTime?.home ?? '?'}-{match.score?.fullTime?.away ?? '?'}
        </span>
        {match.awayTeam?.crest && (
          <img src={match.awayTeam.crest} className="w-3.5 h-3.5 object-contain" alt="" />
        )}
      </div>
    </div>
  );
}

// The long-press list: every live match as its own MiniLiveMatchChip,
// stacked one below the other, popping in with a quick staggered
// list-opening animation (not the multi-second ring/score reveal the big
// card does — these chips have nothing to "reveal", they just show the
// already-known live score).
function LiveMatchesChipList({ liveMatches }) {
  return (
    <div className="flex flex-col items-center gap-2" style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'visible', pointerEvents: 'auto', padding: 12 }}>
      <AnimatePresence>
        {liveMatches.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: -10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <MiniLiveMatchChip match={m} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showGeneralPredictionsOnboarding, setShowGeneralPredictionsOnboarding] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [pendingGeneralQuestions, setPendingGeneralQuestions] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [showExactHits, setShowExactHits] = useState(false); // Kept, but its functionality is replaced for swipe
  const [showLiveData, setShowLiveData] = useState(false); // Added: New state for LiveDataPanel
  const [hasLiveMatch, setHasLiveMatch] = useState(false);
  const [liveMatch, setLiveMatch] = useState(null);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [liveMatches, setLiveMatches] = useState([]);
  const liveChipLongPressTimer = useRef(null);
  const liveChipLongPressFired = useRef(false);
  const [showLiveIntro, setShowLiveIntro] = useState(false);
  const [showLiveMatchesList, setShowLiveMatchesList] = useState(false);
  const [showLiveLeaderboard, setShowLiveLeaderboard] = useState(false);
  const [liveUserPredictions, setLiveUserPredictions] = useState({});
  const [livePredictionLoading, setLivePredictionLoading] = useState(false);
  const [liveCheckDone, setLiveCheckDone] = useState(false);
  const [nextMatch, setNextMatch] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [nextMatchChecked, setNextMatchChecked] = useState(false);
  const [showNextMatchIntro, setShowNextMatchIntro] = useState(false);
  const introShownRef = useRef(false); // resets on every fresh app load — unlike sessionStorage, doesn't persist across reloads
  const [tournamentEnded, setTournamentEnded] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false); // NEW: State for YearlySummaryPanel
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [touchEndY, setTouchEndY] = useState(null);
  const [todayMatchCount, setTodayMatchCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();


  // Animation variants for dropdown - עדכון למהירות איטית יותר
  const dropdownVariants = {
    visible: {
      clipPath: "inset(0% 0% 0% 0% round 12px)",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.6 // הוגדל מ-0.3 ל-0.6
      }
    },
    hidden: {
      clipPath: "inset(10% 50% 90% 50% round 12px)",
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4, // הוגדל מ-0.2 ל-0.4
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
        duration: 0.4, // הוגדל מ-0.2 ל-0.4
        delay: i * 0.1 // הוגדל מ-0.05 ל-0.1
      }
    }),
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(4px)",
      transition: {
        duration: 0.2
      }
    }
  };

  // האזנה לשינויי auth מ-Supabase
  useEffect(() => {
    import('@/api/supabase').then(({ supabase }) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          checkAuthAndLoad();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAuthLoading(false);
        }
      });
      return () => subscription.unsubscribe();
    });
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const currentUser = await User.me();
      await loadUserData(currentUser);
    } catch (error) {
      setUser(null);
      setAuthLoading(false);
    }
  };

  const loadUserData = async (currentUser) => {
    if (!currentUser) { setUser(null); setAuthLoading(false); return; }
    let userWithStats = { ...currentUser };
    try {
      const userStats = await UserStats.filter({ user_id: currentUser.id });
      if (userStats.length > 0) {
        userWithStats.total_points = userStats[0].total_points || 0;
        userWithStats.exact_hits_count = userStats[0].exact_hits_count || 0;
        userWithStats.total_predictions_count = userStats[0].total_predictions_count || 0;
      }
    } catch (e) {}
    setUser(userWithStats);
    setAuthLoading(false);

    // Show push banner if needed
    const bannerKey = `push_banner_dismissed_${currentUser.id}`;
    const bannerDismissed = localStorage.getItem(bannerKey);
    const alreadyGranted = typeof Notification !== 'undefined' && Notification.permission === 'granted';
    const isStandalonePWA = window.navigator.standalone === true;
    // On iOS PWA: always show if not granted (ignore dismissed flag)
    // On other platforms: show if not dismissed and not granted
    if (!alreadyGranted && (isStandalonePWA || !bannerDismissed)) {
      setShowPushBanner(true);
    }
  };

  // CRITICAL CHANGE: Load user data from UserStats instead of User entity for points
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await User.me();
        console.log("🔍 Layout checkAuth - currentUser:", currentUser);

        // NEW: Load user's points from UserStats instead of User entity
        let userWithStats = { ...currentUser };
        if (currentUser) {
          try {
            const userStats = await UserStats.filter({ user_id: currentUser.id });
            if (userStats.length > 0) {
              userWithStats.total_points = userStats[0].total_points || 0;
              userWithStats.exact_hits_count = userStats[0].exact_hits_count || 0;
              userWithStats.total_predictions_count = userStats[0].total_predictions_count || 0;
              console.log(`Layout: Loaded user stats from UserStats entity: ${userWithStats.total_points} points`);
            } else {
              userWithStats.total_points = 0;
              userWithStats.exact_hits_count = 0;
              userWithStats.total_predictions_count = 0;
              console.log(`Layout: No UserStats found for user ${currentUser.id}, using default values`);
            }
          } catch (error) {
            console.error("Layout: Error loading UserStats, using default values:", error);
            userWithStats.total_points = 0;
            userWithStats.exact_hits_count = 0;
            userWithStats.total_predictions_count = 0;
          }

        } else {
          userWithStats = null;
        }

        setUser(userWithStats);

        // פלואו אונבורדינג: WelcomeModal → שאלות כלליות (אם יש כאלה שטרם נענו) → דשבורד
        if (currentUser) {
          const hasCompletedWelcome = localStorage.getItem('welcome_completed_' + currentUser.id) === 'true';
          if (!hasCompletedWelcome) {
            setShowWelcomeModal(true);
          } else {
            // משתמש ותיק שכבר עבר את ה-Welcome — עדיין בודקים בכל טעינה אם יש
            // שאלה כללית חדשה שהתווספה מאז ועוד לא נענתה, לא רק בהרשמה הראשונה.
            checkPendingGeneralQuestions(currentUser.id);
          }
        }

      } catch (error) {
        // בדיקה אם המשתמש מחובר ב-auth אבל הפרופיל נכשל
        try {
          const { supabase } = await import('@/api/supabase');
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // המשתמש מחובר אבל הפרופיל נכשל — נציג מידע בסיסי
            setUser({
              id: session.user.id,
              email: session.user.email,
              display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url,
              is_admin: false,
            });
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Add effect to handle dashboard reload events
  useEffect(() => {
    if (location.pathname.includes('Dashboard')) {
      setTimeout(() => {
        window.dispatchEvent(new Event('dashboardReload'));
      }, 200);
    }
  }, [location.pathname]);

  // CRITICAL CHANGE: Listen to score calculation updates to refresh user stats
  useEffect(() => {
    const handleDashboardReload = async () => {
      if (user && user.id) {
        try {
          const userStats = await UserStats.filter({ user_id: user.id });
          if (userStats.length > 0) {
            setUser((prev) => ({
              ...prev,
              total_points: userStats[0].total_points || 0,
              exact_hits_count: userStats[0].exact_hits_count || 0,
              total_predictions_count: userStats[0].total_predictions_count || 0
            }));
            console.log(`Layout: Refreshed user stats: ${userStats[0].total_points} points`);
          } else {
            setUser((prev) => ({
              ...prev,
              total_points: 0,
              exact_hits_count: 0,
              total_predictions_count: 0
            }));
            console.warn(`Layout: UserStats not found for user ${user.id} after dashboard reload.`);
          }
        } catch (error) {
          console.error("Layout: Error refreshing user stats:", error);
        }
      }
    };

    window.addEventListener('dashboardReload', handleDashboardReload);
    return () => window.removeEventListener('dashboardReload', handleDashboardReload);
  }, [user]);

  // Add effect to handle live data panel opening from admin
  useEffect(() => {
    const handleOpenLiveDataPanel = () => {
      setShowLiveData(true);
      setShowLeaderboard(false);
      setShowExactHits(false); // Ensure ExactHits is also closed
      setShowSidebar(false); // Close sidebar if open
    };

    window.addEventListener('openLiveDataPanel', handleOpenLiveDataPanel);
    return () => window.removeEventListener('openLiveDataPanel', handleOpenLiveDataPanel);
  }, []);

  // Poll for live matches to show/hide the LIVE button (detection only — the
  // intro-overlay trigger is a separate effect below, gated on the loader).
  useEffect(() => {
    const checkLive = async () => {
      try {
        const now = new Date();
        const localDate = now.toLocaleDateString('sv-SE');
        const prevLocalDate = new Date(now - 864e5).toLocaleDateString('sv-SE');
        const res = await fetch(`/api/football?competition=${TOURNAMENT_CODE}&filter=LIVE&dateFrom=${prevLocalDate}&dateTo=${localDate}`);
        const json = await res.json();
        const live = (json.matches || []).filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
        // Flip prediction-loading on in the same batch as hasLiveMatch, so the
        // "show the overlay" trigger effect never sees hasLiveMatch=true paired
        // with a stale livePredictionLoading=false from before the fetch effect
        // below even started — otherwise the card could flash in without its
        // prediction row and have it pop in a moment later.
        if (live.length > 0) setLivePredictionLoading(true);
        setHasLiveMatch(live.length > 0);
        setLiveMatch(live[0] || null);
        setLiveMatchCount(live.length);
        setLiveMatches(live);
      } catch {
        setHasLiveMatch(false);
      } finally {
        setLiveCheckDone(true);
      }
    };
    checkLive();
    const iv = setInterval(checkLive, 60000);
    return () => clearInterval(iv);
  }, []);

  // Show one intro overlay after the app's own loader has finished — live
  // match takes priority; otherwise the next upcoming match, if any. Waiting
  // for both checks to resolve avoids flashing the wrong one while the live
  // check is still in flight. Also waits for the welcome/intro-video
  // onboarding flow to finish first — otherwise this fires (and burns its
  // one-time flag) underneath/behind those modals, so it never actually
  // gets seen once they close. Uses an in-memory ref (not sessionStorage) so
  // it shows again on every fresh app load, while still only firing once
  // per continuous visit even if hasLiveMatch/nextMatch change mid-session.
  useEffect(() => {
    if (authLoading || !liveCheckDone || !nextMatchChecked) return;
    if (showWelcomeModal || showGeneralPredictionsOnboarding || showIntroVideo) return;
    if (hasLiveMatch && livePredictionLoading) return; // wait so the card appears complete, prediction included
    if (introShownRef.current) return;
    introShownRef.current = true;
    if (tournamentEnded) {
      setShowFinalResults(true);
    } else if (hasLiveMatch) {
      setShowLiveIntro(true);
    } else if (nextMatch) {
      setShowNextMatchIntro(true);
    }
  }, [authLoading, liveCheckDone, nextMatchChecked, hasLiveMatch, nextMatch, livePredictionLoading, showWelcomeModal, showGeneralPredictionsOnboarding, showIntroVideo, tournamentEnded]);

  // "משחקי היום" shows the day's matches as a typewriter-revealed list right
  // away — no solo "המשחק הקרוב" screen first (the ticker bar already covers
  // that). Auto-dismisses after LIST_MS, closable anytime before that.
  const LIST_MS = 10000;
  useEffect(() => {
    if (!showNextMatchIntro) return;
    const t = setTimeout(() => setShowNextMatchIntro(false), LIST_MS);
    return () => clearTimeout(t);
  }, [showNextMatchIntro]);

  // Fetch the user's prediction for every concurrently live match (not just
  // the first one) — keyed by the API match id so LiveMatchesGrid can look
  // each one up per tile.
  const liveMatchIdsKey = liveMatches.map(m => m.id).join(',');
  useEffect(() => {
    if (liveMatches.length === 0 || !user?.id) { setLivePredictionLoading(false); return; }
    let cancelled = false;
    setLivePredictionLoading(true);
    setLiveUserPredictions({});
    const fetchLivePredictions = async () => {
      try {
        const allMatches = await Match.list();
        const entries = await Promise.all(liveMatches.map(async (lm) => {
          const apiHome = (lm.homeTeam?.name || '').toLowerCase();
          const apiAway = (lm.awayTeam?.name || '').toLowerCase();
          const supabaseMatch = allMatches.find(m => {
            const a = (m.team_a || '').toLowerCase();
            const b = (m.team_b || '').toLowerCase();
            const homeMatch = apiHome.includes(a.slice(0, 4)) || a.includes(apiHome.slice(0, 4));
            const awayMatch = apiAway.includes(b.slice(0, 4)) || b.includes(apiAway.slice(0, 4));
            return homeMatch && awayMatch;
          });
          if (!supabaseMatch) return null;
          const preds = await Prediction.filter({ match_id: supabaseMatch.id, user_id: user.id });
          return preds.length > 0 ? [lm.id, preds[0]] : null;
        }));
        if (!cancelled) setLiveUserPredictions(Object.fromEntries(entries.filter(Boolean)));
      } catch {
        // no predictions to show — overlay still proceeds with just live scores
      } finally {
        if (!cancelled) setLivePredictionLoading(false);
      }
    };
    fetchLivePredictions();
    return () => { cancelled = true; };
  }, [liveMatchIdsKey, user?.id]);

  // Auto-dismiss the live intro — but only start the countdown once we know
  // whether there's a prediction to show, so it never disappears mid-fetch.
  // Scales with how many tiles the grid has to stagger through (see
  // LiveMatchesGrid's own REVEAL_STEP_MS) so it never cuts the reveal off
  // partway with several concurrent matches.
  useEffect(() => {
    if (!showLiveIntro || livePredictionLoading) return;
    const revealMs = Math.max(0, liveMatches.length - 1) * REVEAL_STEP_MS;
    const t = setTimeout(() => setShowLiveIntro(false), 7000 + revealMs);
    return () => clearTimeout(t);
  }, [showLiveIntro, livePredictionLoading, liveMatches.length]);

  // Hard safety cap — never let the overlay block the UI indefinitely even
  // if the prediction fetch hangs.
  useEffect(() => {
    if (!showLiveIntro) return;
    const revealMs = Math.max(0, liveMatches.length - 1) * REVEAL_STEP_MS;
    const cap = setTimeout(() => setShowLiveIntro(false), 16000 + revealMs);
    return () => clearTimeout(cap);
  }, [showLiveIntro, liveMatches.length]);

  // Once the live-match intro card closes, surface the live leaderboard so
  // its data starts loading right as the card leaves the screen instead of
  // sitting inline (and fetching) the whole time the intro is up.
  const wasShowingLiveIntro = useRef(false);
  useEffect(() => {
    if (wasShowingLiveIntro.current && !showLiveIntro && hasLiveMatch) {
      setShowLiveLeaderboard(true);
    }
    wasShowingLiveIntro.current = showLiveIntro;
  }, [showLiveIntro, hasLiveMatch]);

  // Load today's match count for FAB badge + find the next upcoming match
  useEffect(() => {
    const todayKey = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    })();
    Match.list().then(all => {
      const count = all.filter(m => {
        const md = new Date(m.match_date);
        const k = `${md.getFullYear()}-${String(md.getMonth()+1).padStart(2,'0')}-${String(md.getDate()).padStart(2,'0')}`;
        return k === todayKey;
      }).length;
      setTodayMatchCount(count);

      const now = new Date();
      // "משחקי היום" — strictly today's remaining matches. If there's nothing
      // left today, there's nothing to show (no falling back to a future
      // matchday's fixtures).
      const todaysRemaining = all
        .filter(m => !m.is_finished && new Date(m.match_date) > now && localDayKey(new Date(m.match_date)) === todayKey)
        .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
      setNextMatch(todaysRemaining[0] || null);
      setUpcomingMatches(todaysRemaining);
      setTournamentEnded(all.length > 0 && all.every(m => m.is_finished));
    }).catch(() => {}).finally(() => setNextMatchChecked(true));
  }, []);

  // Add effect to handle yearly summary panel opening
  useEffect(() => {
    const handleOpenYearlySummaryPanel = () => {
      setShowYearlySummary(true);
      setShowLeaderboard(false);
      setShowExactHits(false);
      setShowLiveData(false);
      setShowSidebar(false);
    };

    window.addEventListener('openYearlySummaryPanel', handleOpenYearlySummaryPanel);
    return () => window.removeEventListener('openYearlySummaryPanel', handleOpenYearlySummaryPanel);
  }, []);

  // כפתור Back במובייל — סוגר panels לפי סדר עדיפות (ref למניעת stale closure)
  const panelStateRef = useRef({});
  useEffect(() => {
    panelStateRef.current = { showLeaderboard, showExactHits, showSidebar, showYearlySummary };
  });
  useEffect(() => {
    const anyOpen = showLeaderboard || showExactHits || showSidebar || showYearlySummary;
    if (!anyOpen) return;
    window.history.pushState({ panel: 'layout' }, '');
    const handlePop = () => {
      const s = panelStateRef.current;
      if (s.showSidebar)       { setShowSidebar(false);        return; }
      if (s.showLeaderboard)   { setShowLeaderboard(false);    return; }
      if (s.showExactHits)     { setShowExactHits(false);      return; }
      if (s.showYearlySummary) { setShowYearlySummary(false);  return; }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [showLeaderboard, showExactHits, showSidebar, showYearlySummary]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY); // NEW: Track Y coordinate
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchStartY) return;

    const screenHeight = window.innerHeight;

    if (!touchEnd) return;

    const isDashboardPage = location.pathname === '/' || location.pathname.includes('Dashboard');
    const isUpperHalf = touchStartY < screenHeight * 0.5;

    // CORRECTED LOGIC: Keep Dashboard logic exactly as it was
    // Dashboard: Upper half = YES SWIPE, Lower half = NO SWIPE (to protect rounds marquee)
    // Other pages: Full screen = YES SWIPE
    if (isDashboardPage && !isUpperHalf) {
      // Dashboard lower half - NO SWIPE (original logic)
      setTouchStart(null);
      setTouchEnd(null);
      setTouchStartY(null);
      return;
    }

    // For Dashboard upper half OR any other page - allow swipe gestures
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 100; // Swiped left (finger moved from right to left)
    const isRightSwipe = distance < -100; // Swiped right (finger moved from left to right)
    const screenWidth = window.innerWidth;
    const centerZone = screenWidth * 0.3; // 30% of screen width from each side

    // Check if swipe started in the center area of the screen
    if (touchStart > centerZone && touchStart < screenWidth - centerZone) {
      if (isRightSwipe) {
        setShowLeaderboard(true);
      }
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartY(null);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await User.loginWithRedirect(window.location.origin);
    } catch (error) {
      console.error("Error logging in:", error);
      alert("שגיאה בכניסה: " + (error?.message || JSON.stringify(error)));
    }
  };

  // לוגיקה חדשה: נקראת לאחר שהמשתמש שמר שם תצוגה
  const handleProfileSaved = async (displayName) => {
    if (user && user.id) {
      try {
        const existingStats = await UserStats.filter({ user_id: user.id });
        if (existingStats.length === 0) {
          await UserStats.create({
            user_id: user.id,
            total_points: 0,
            exact_hits_count: 0,
            total_predictions_count: 0
          });
        }
      } catch (statsErr) {
        console.warn("UserStats init failed (non-critical):", statsErr?.message);
      }
    }

    setUser((prev) => ({ ...prev, display_name: displayName }));
    try { localStorage.setItem('welcome_completed_' + (user?.id ?? ''), 'true'); } catch {}
    setShowWelcomeModal(false);
    await maybeShowGeneralPredictionsOnboarding(user?.id);
  };

  // Returns active general-prediction questions (e.g. "who wins the
  // tournament") this user hasn't answered yet — [] once league-phase
  // matchday 1 has kicked off (predictions closed for latecomers) or on any
  // fetch error. Checking "missing an answer row" (not a boolean flag) means
  // a newly-added question reaches already-registered users automatically,
  // without needing its own migration/flag.
  const getUnansweredGeneralQuestions = async (userId) => {
    if (!userId) return [];
    try {
      const [activeQuestions, myAnswers, allMatches] = await Promise.all([
        GeneralQuestion.filter({ is_active: true }),
        GeneralPrediction.filter({ user_id: userId }),
        Match.filter({ stage: 'league_phase' }),
      ]);

      const earliestKickoff = allMatches.reduce((min, m) => {
        const t = new Date(m.match_date).getTime();
        return min === null || t < min ? t : min;
      }, null);
      const isLocked = earliestKickoff !== null && Date.now() >= earliestKickoff;
      if (isLocked) return [];

      const answeredIds = new Set(myAnswers.map((a) => a.question_id));
      return activeQuestions.filter((q) => !answeredIds.has(q.id));
    } catch (err) {
      console.warn("General predictions check failed (non-critical):", err?.message);
      return [];
    }
  };

  // Called once, right after WelcomeModal closes — shows the onboarding
  // modal if there's anything unanswered, otherwise goes straight to
  // Dashboard exactly like before this feature existed.
  const maybeShowGeneralPredictionsOnboarding = async (userId) => {
    const unanswered = await getUnansweredGeneralQuestions(userId);
    if (unanswered.length > 0) {
      setPendingGeneralQuestions(unanswered);
      setShowGeneralPredictionsOnboarding(true);
      return;
    }
    finishNewUserOnboarding(userId);
  };

  // Called on every app load for returning users (who already passed
  // WelcomeModal in a past session) — same check, but never force-navigates,
  // since the user may already be headed anywhere in the app.
  const checkPendingGeneralQuestions = async (userId) => {
    const unanswered = await getUnansweredGeneralQuestions(userId);
    if (unanswered.length > 0) {
      setPendingGeneralQuestions(unanswered);
      setShowGeneralPredictionsOnboarding(true);
    }
  };

  const handleGeneralPredictionsOnboardingDone = () => {
    setShowGeneralPredictionsOnboarding(false);
    setPendingGeneralQuestions([]);
    finishNewUserOnboarding(user?.id);
  };

  // End of the new-user onboarding chain (WelcomeModal → general questions,
  // if any). Shows the one-time intro video exactly once per user, then
  // navigates to Dashboard exactly like before this video existed — never
  // shown again once marked seen, and never shown to returning users at all
  // since this is only reachable from the two call sites above.
  const finishNewUserOnboarding = (userId) => {
    const seen = (() => { try { return localStorage.getItem('intro_video_seen_' + (userId ?? '')) === 'true'; } catch { return true; } })();
    if (!seen) {
      setShowIntroVideo(true);
      return;
    }
    navigate(createPageUrl("Dashboard"));
  };

  const handleIntroVideoDone = () => {
    try { localStorage.setItem('intro_video_seen_' + (user?.id ?? ''), 'true'); } catch {}
    setShowIntroVideo(false);
    navigate(createPageUrl("Dashboard"));
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <>
        <style jsx global>{`
          ::-webkit-scrollbar {
            display: none;
          }
          html {
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
          }
          @keyframes shine {
            from {
              background-position: 0 0;
            }
            to {
              background-position: -200% 0;
            }
          }
          
          .animate-shine {
            animation: shine 2s linear infinite;
          }
        `}</style>
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#030d0a' }}>
          <div className="relative z-10 text-center">
            <LoaderBar text="LOADING" />
          </div>
        </div>
      </>);
  }

  return (
    <LayoutGroup>
    <>
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
        @keyframes shine {
          from {
            background-position: 0 0;
          }
          to {
            background-position: -200% 0;
          }
        }
        
        .animate-shine {
          animation: shine 2s linear infinite;
        }
      `}</style>
      <div
        className="min-h-screen text-white relative overflow-x-clip"
        style={{ background: '#030d1a', fontFamily: "'Outfit', sans-serif" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>

        {/* Champions League starball backdrop — sits behind every page */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            backgroundImage: 'url(/champions/background.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            background: 'linear-gradient(180deg, rgba(3,13,26,0.25) 0%, rgba(3,13,26,0.5) 55%, rgba(3,13,26,0.85) 100%)',
          }}
        />

{/* Glass navbar strip — not on Dashboard */}
        {!location.pathname.includes('Dashboard') && location.pathname !== '/' && (
          <div
            className="fixed left-0 right-0 pointer-events-none"
            style={{
              top: '36px',
              height: '65px',
              zIndex: 35,
              background: 'rgba(5,10,20,0.35)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        )}

        {/* כפתור המבורגר + כפתור איצטדיון מתחתיו */}
        <div className="fixed top-[38px] left-4 z-40 flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setShowSidebar(true)}
            className="p-0 w-[60px] h-[60px] flex items-center justify-center rounded-xl transition-colors hover:bg-slate-700/40 backdrop-blur-sm border-0 bg-transparent shadow-none">
            <img
              src="/football-field.png"
              alt="Menu" className="mb-2 w-full h-full object-contain rounded-lg" />
          </Button>

          <AnimatePresence>
            {(location.pathname === '/' || location.pathname.includes('Dashboard')) && todayMatchCount > 0 && !showDateSheet && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowDateSheet(true)}
                className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, #1a3a2a 0%, #0d2018 100%)',
                  border: '1.5px solid rgba(9, 122, 220,0.5)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              >
                <span className="text-xl select-none">🏟️</span>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-sky-400 text-black text-[9px] font-bold flex items-center justify-center shadow-md"
                >
                  {todayMatchCount}
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Menu Cards */}
        <AnimatePresence>
          {showSidebar &&
          <>
              {/* Overlay */}
              <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowSidebar(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} />


              {/* Grid of Cards - ללא קלף תוצאות חיות */}
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
              onClick={() => setShowSidebar(false)}> {/* Added onClick to close sidebar */}

                <div className="grid grid-cols-2 gap-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}> {/* Added onClick to stop propagation */}
                  {/* Leaderboard Card - קלף ראשון - מהפינה השמאלית העליונה */}
                  <motion.div
                  initial={{ x: "-100%", y: "-100%" }}
                  animate={{ x: 0, y: 0 }}
                  exit={{ x: "-100%", y: "-100%" }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.05
                  }}
                  onClick={(e) => {// Added e.stopPropagation()
                    e.stopPropagation();
                    setShowLeaderboard(true);
                    setShowSidebar(false);
                  }}
                  className="inline-flex animate-shine items-center justify-start rounded-xl text-sm border border-neutral-800 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] p-6 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-105 flex-col text-center h-40">

                    <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a99a73381_image.png"
                    alt="Leaderboard"
                    className="w-14 h-14 object-contain mb-4 shrink-0" />

                    <div className="flex-1 flex items-start justify-center">
                      <h3 className="text-white text-base font-semibold leading-tight">טבלה</h3>
                    </div>
                  </motion.div>

                  {/* Exact Hits Card - קלף שני - מהפינה הימנית העליונה - החזרה */}
                  <motion.div
                  initial={{ x: "100%", y: "-100%" }}
                  animate={{ x: 0, y: 0 }}
                  exit={{ x: "100%", y: "-100%" }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.1
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExactHits(true);
                    setShowSidebar(false);
                  }}
                  className="inline-flex animate-shine items-center justify-start rounded-xl text-sm border border-neutral-800 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] p-6 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-105 flex-col text-center h-40">

                    <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ec75a888_target_5987470.png"
                    alt="Exact Hits"
                    className="w-14 h-14 object-contain mb-4 shrink-0" />

                    <div className="flex-1 flex items-start justify-center">
                      <h3 className="text-white text-base font-semibold leading-tight">פגיעות מדויקות</h3>
                    </div>
                  </motion.div>

                  {/* My Stats Card - עם אפקט מונפש - מהפינה השמאלית התחתונה */}
                  <motion.div
                  initial={{ x: "-100%", y: "100%" }}
                  animate={{ x: 0, y: 0 }}
                  exit={{ x: "-100%", y: "100%" }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.15
                  }}
                  onClick={(e) => {// Added e.stopPropagation()
                    e.stopPropagation();
                    navigate(createPageUrl("MyStats"));
                    setShowSidebar(false);
                  }}
                  className="inline-flex animate-shine items-center justify-start rounded-xl text-sm border border-neutral-800 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] p-6 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-105 flex-col text-center h-40">

                    <div className="h-16 flex items-center justify-center mb-4 shrink-0">
                      <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/04dbdbc00_web_15025147.png"
                      alt="Stats"
                      className="w-12 h-12 object-contain" />
                    </div>

                    <div className="flex-1 flex items-start justify-center">
                      <h3 className="text-white text-base font-semibold leading-tight">סטטיסטיקה</h3>
                    </div>
                  </motion.div>

                  {/* Predictions Results Card - קלף רביעי - מהפינה הימנית התחתונה */}
                  <motion.div
                  initial={{ x: "100%", y: "100%" }}
                  animate={{ x: 0, y: 0 }}
                  exit={{ x: "100%", y: "100%" }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.2
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(createPageUrl("PredictionsResults"));
                    setShowSidebar(false);
                  }}
                  className="inline-flex animate-shine items-center justify-start rounded-xl text-sm border border-neutral-800 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] p-6 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-105 flex-col text-center h-40">

                    <img
                    src="/icon-scoreboard.png"
                    alt="Predictions Results"
                    className="w-16 h-16 object-contain mb-4 shrink-0" />

                    <div className="flex-1 flex items-start justify-center">
                      <h3 className="text-white text-base font-semibold leading-tight">ניחושים ותוצאות</h3>
                    </div>
                  </motion.div>

                  {/* General Predictions Board Card - קלף חמישי, שורה מלאה מתחת לגריד 2x2 */}
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.25
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(createPageUrl("GeneralPredictionsBoard"));
                    setShowSidebar(false);
                  }}
                  className="col-span-2 inline-flex animate-shine items-center justify-center rounded-xl text-sm border border-neutral-800 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] p-4 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-105">
                    <h3 className="text-white text-base font-semibold leading-tight">🎯 ניחושים כלליים</h3>
                  </motion.div>

                </div>
              </motion.div>
            </>
          }
        </AnimatePresence>

        {/* כפתור כניסה כשאין משתמש מחובר */}
        {!user && !authLoading &&
        <div className="fixed top-[38px] right-4 z-40">
          <Button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm shadow-lg"
          >
            התחבר עם Google
          </Button>
        </div>
        }

        {/* User Info & Admin Button */}
        {user &&
        <div className="fixed top-[44px] right-4 z-40 flex flex-col items-center gap-5">

            <div className="flex items-center gap-2">

            {/* Notification Bell — manual fallback in case the auto-request
                (push banner on first login) failed or was dismissed. */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={async () => {
                const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
                const isStandalone = window.navigator.standalone === true;
                if (isIOS && !isStandalone) {
                  setShowPushBanner(true);
                  return;
                }
                if (notifPermission !== 'granted' && window.OneSignal) {
                  try {
                    await window.OneSignal.Notifications.requestPermission();
                    if (typeof Notification !== 'undefined') {
                      setNotifPermission(Notification.permission);
                    }
                  } catch (e) {}
                }
              }}
              className="flex items-center justify-center rounded-full w-9 h-9 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(8,20,50,0.55) 100%)',
                border: `1px solid ${notifPermission === 'granted' ? 'rgba(245,197,24,0.6)' : 'rgba(255,255,255,0.15)'}`,
                backdropFilter: 'blur(28px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                boxShadow: notifPermission === 'granted'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 10px rgba(245,197,24,0.35)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {notifPermission === 'granted'
                ? <Bell className="w-4 h-4" style={{ color: '#f5c518' }} />
                : <BellOff className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
              }
            </motion.button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-transparent border-none p-0">

                  {/* Replaced AnimatedBorderButton with a simple div as per outline */}
                  <div
                    className="flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(8,20,50,0.55) 100%)',
                      border: '1px solid rgba(9, 122, 220,0.35)',
                      backdropFilter: 'blur(28px) saturate(1.6)',
                      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8e94debbc_ssmvtnogc7ue0jufjd03h6mj89.png"
                      alt="User Profile"
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      style={{ boxShadow: '0 0 0 2px #097adc' }}
                    />
                    <span
                      className="text-white text-sm font-semibold"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {user.display_name || user.full_name}
                    </span>
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
              className="shadow-2xl rounded-2xl min-w-[180px]"
              style={{ background: 'rgba(8,22,45,0.96)', border: '1px solid rgba(9, 122, 220,0.25)', backdropFilter: 'blur(20px)' }}>

                <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="p-1">

                  {user.is_admin &&
                <motion.div
                  custom={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible">

                      <DropdownMenuItem
                    onClick={() => navigate(createPageUrl("Admin"))}
                    className="cursor-pointer text-white hover:text-sky-300 hover:bg-slate-700/60 focus:bg-slate-700/60 focus:text-sky-300 rounded-md px-3 py-2 flex items-center gap-3 transition-all duration-300 font-medium">

                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    </motion.div>
                }
                  <motion.div
                  custom={1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible">

                    <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-white hover:text-red-300 hover:bg-slate-700/60 focus:bg-slate-700/60 focus:text-red-300 rounded-md px-3 py-2 flex items-center gap-3 transition-all duration-300 font-medium">

                      <LogOut className="w-4 h-4" />
                      <span>התנתק</span>
                    </DropdownMenuItem>
                  </motion.div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>

            </div>

            <div style={{ position: 'relative' }}>
            <AnimatePresence>
              {hasLiveMatch && !showLiveIntro && (location.pathname === '/' || location.pathname.includes('Dashboard')) && (
                <motion.button
                  layoutId="live-chip"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                  onClick={() => {
                    // A long-press already opened the full matches grid below —
                    // swallow the click the browser synthesizes right after touchend
                    // so it doesn't also open the side panel underneath it.
                    if (liveChipLongPressFired.current) { liveChipLongPressFired.current = false; return; }
                    if (showLiveMatchesList) { setShowLiveMatchesList(false); return; }
                    setShowLiveData(true); setShowLeaderboard(false);
                  }}
                  onMouseDown={() => {
                    liveChipLongPressFired.current = false;
                    liveChipLongPressTimer.current = setTimeout(() => {
                      liveChipLongPressFired.current = true;
                      setShowLiveMatchesList(true);
                    }, 450);
                  }}
                  onMouseUp={() => clearTimeout(liveChipLongPressTimer.current)}
                  onMouseLeave={() => clearTimeout(liveChipLongPressTimer.current)}
                  onTouchStart={() => {
                    liveChipLongPressFired.current = false;
                    liveChipLongPressTimer.current = setTimeout(() => {
                      liveChipLongPressFired.current = true;
                      setShowLiveMatchesList(true);
                    }, 450);
                  }}
                  onTouchEnd={() => clearTimeout(liveChipLongPressTimer.current)}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-full cursor-pointer"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.45)',
                    backdropFilter: 'blur(28px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  {liveMatch ? (
                    <div className="flex items-center gap-1" dir="ltr">
                      {liveMatch.homeTeam?.crest && (
                        <img src={liveMatch.homeTeam.crest} className="w-3.5 h-3.5 object-contain" alt="" />
                      )}
                      <span className="text-white text-[11px] font-bold">
                        {liveMatch.score?.fullTime?.home ?? '?'}-{liveMatch.score?.fullTime?.away ?? '?'}
                      </span>
                      {liveMatch.awayTeam?.crest && (
                        <img src={liveMatch.awayTeam.crest} className="w-3.5 h-3.5 object-contain" alt="" />
                      )}
                      {liveMatchCount > 1 && (
                        <span className="text-red-400 text-[10px] font-bold">+{liveMatchCount - 1}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-400 text-[11px] font-bold tracking-widest uppercase animate-pulse">Live</span>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Long-press list — anchored right under the chip itself (same
                position as the chip that opened it), not a centered modal. */}
            <AnimatePresence>
              {showLiveMatchesList && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  // Anchored to the chip's right edge, not centered under it —
                  // the chip sits right at the screen's own right margin
                  // (right-4), so centering pushed half the dropdown off-screen.
                  // Growing leftward from the same right edge keeps it fully
                  // on-screen regardless of how wide the chip itself is.
                  style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 60 }}
                >
                  <LiveMatchesChipList liveMatches={liveMatches} />
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        }

        {/* Invisible click-catcher — closes the long-press list on any tap
            outside it, without darkening the screen like a modal. Sits just
            below the header's own z-40 stacking context so the chip/dropdown
            (nested inside that context) stay on top and still receive their
            own clicks; everywhere else on screen hits this and closes it. */}
        {showLiveMatchesList && (
          <div className="fixed inset-0 z-[39]" onClick={() => setShowLiveMatchesList(false)} />
        )}

        {/* Live Intro Overlay */}
        <AnimatePresence>
          {showLiveIntro && (
            <>
              <motion.div
                key="live-intro-bg"
                className="fixed inset-0 z-[55]"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setShowLiveIntro(false)}
              />
              <div className="fixed inset-0 z-[56] flex items-center justify-center pointer-events-none">
                <LiveMatchesGrid
                  liveMatches={liveMatches}
                  liveUserPredictions={liveUserPredictions}
                  compact={liveMatches.length > 1}
                />
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Live Leaderboard Overlay — opens right after the live-match intro
            closes, in a mobile-sized container; closing it returns home */}
        <AnimatePresence>
          {showLiveLeaderboard && (
            <>
              <motion.div
                key="live-lb-bg"
                className="fixed inset-0 z-[55]"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => { setShowLiveLeaderboard(false); navigate(createPageUrl("Dashboard")); }}
              />
              <div className="fixed inset-0 z-[56] flex items-center justify-center px-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="pointer-events-auto rounded-2xl w-full flex flex-col"
                  style={{
                    maxWidth: 'min(400px, 92vw)',
                    maxHeight: '82vh',
                    background: 'rgba(8,18,32,0.95)',
                    backdropFilter: 'blur(28px)',
                    boxShadow: '0 0 60px rgba(239,68,68,0.18), 0 20px 60px rgba(0,0,0,0.7)',
                    overflow: 'hidden',
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-white text-sm font-bold">טבלת דירוג חיה</span>
                    <button
                      onClick={() => { setShowLiveLeaderboard(false); navigate(createPageUrl("Dashboard")); }}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/8"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-white/10">
                    <LiveLeaderboard />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Next Match Intro Overlay — shown once per fresh app load when there's
            no live match. Goes straight to a typewriter-revealed grid of the
            day's matches — no solo "המשחק הקרוב" screen first (the ticker
            bar already covers that). Closable anytime, auto-dismisses after
            LIST_MS. */}
        <AnimatePresence>
          {showNextMatchIntro && upcomingMatches.length > 0 && (
            <>
              <motion.div
                key="next-match-intro-bg"
                className="fixed inset-0 z-[55]"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              <div className="fixed inset-0 z-[56] flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1, scale: 1,
                    boxShadow: [
                      '0 0 60px rgba(139,92,246,0.2), 0 20px 60px rgba(0,0,0,0.7)',
                      '0 0 90px rgba(96,165,250,0.45), 0 20px 60px rgba(0,0,0,0.7)',
                      '0 0 60px rgba(139,92,246,0.2), 0 20px 60px rgba(0,0,0,0.7)',
                    ],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(76,29,149,0.95) 0%, rgba(8,18,32,0.95) 45%, rgba(29,78,216,0.95) 100%)',
                    border: '1px solid rgba(167,139,250,0.4)',
                    backdropFilter: 'blur(28px)',
                    pointerEvents: 'auto',
                  }}
                  transition={{
                    scale: { type: 'spring', stiffness: 180, damping: 26 },
                    opacity: { type: 'spring', stiffness: 180, damping: 26 },
                    boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <div className="px-6 py-6 flex flex-col items-center gap-3" style={{ width: 380 }}>
                    <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">משחקי היום</span>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {upcomingMatches.map((m, i) => (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, scale: 0.6, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                          className="flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <div className="flex items-center gap-1.5">
                              <TeamFlag logo={m.team_a_logo} name={m.team_a} className="w-7 h-7 flex-shrink-0" animate={false} />
                              <TeamFlag logo={m.team_b_logo} name={m.team_b} className="w-7 h-7 flex-shrink-0" animate={false} />
                            </div>
                          <span className="text-slate-400 text-[10px] font-bold flex-shrink-0" dir="ltr">
                            {new Date(m.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowNextMatchIntro(false)}
                      className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold bg-white/8 text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                    >
                      סגור
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Final Results Overlay — shown once per session once every match in
            the tournament is finished, in place of the live/next-match intro. */}
        <AnimatePresence>
          {showFinalResults && (
            <FinalResultsOverlay onClose={() => setShowFinalResults(false)} />
          )}
        </AnimatePresence>

        <MatchTickerBar onClick={() => setShowDateSheet(true)} />

        <main className="relative pt-24 pb-20">
          {children}
        </main>

        <WelcomeModal
          isOpen={showWelcomeModal}
          onSave={handleProfileSaved}
          userEmail={user?.email}
          currentUser={user} />

        <GeneralPredictionsOnboarding
          isOpen={showGeneralPredictionsOnboarding}
          questions={pendingGeneralQuestions}
          userId={user?.id}
          onDone={handleGeneralPredictionsOnboardingDone} />

        <IntroVideoModal
          isOpen={showIntroVideo}
          onDone={handleIntroVideoDone} />

        <AnimatePresence>
          {showLeaderboard &&
          <LeaderboardPanel
            onClose={() => setShowLeaderboard(false)}
            user={user} />

          }
        </AnimatePresence>

        {/* החזרת ExactHitsPanel לתפריט */}
        <AnimatePresence>
          {showExactHits &&
          <ExactHitsPanel
            onClose={() => setShowExactHits(false)}
            user={user} />

          }
        </AnimatePresence>

        {/* Added LiveDataPanel - רק בהחלקה */}
        <AnimatePresence>
          {showLiveData &&
          <LiveDataPanel
            onClose={() => setShowLiveData(false)}
            user={user} />

          }
        </AnimatePresence>

        {/* NEW: YearlySummaryPanel */}
        <AnimatePresence>
          {showYearlySummary &&
          <YearlySummaryPanel
            onClose={() => setShowYearlySummary(false)}
            user={user} />

          }
        </AnimatePresence>

        <MatchesByDateSheet isOpen={showDateSheet} onClose={() => setShowDateSheet(false)} />

        {/* Push Notification Banner — held back until the full onboarding
            chain (welcome name, general questions, intro video) is done,
            same reasoning as the live/next-match intro overlays below. */}
        <AnimatePresence>
          {showPushBanner && !showWelcomeModal && !showGeneralPredictionsOnboarding && !showIntroVideo && (() => {
            const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
            const isStandalone = window.navigator.standalone === true;
            const isIOSBrowser = isIOS && !isStandalone;
            const bannerKey = `push_banner_dismissed_${user?.id}`;

            return (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-sm"
              >
                <div className="bg-slate-900 border border-yellow-400/40 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
                  <span className="text-2xl">{isIOSBrowser ? '📲' : '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    {isIOSBrowser ? (
                      <>
                        <p className="text-white text-sm font-semibold leading-tight">להפעלת התראות</p>
                        <p className="text-slate-400 text-xs mt-0.5">הוסף למסך הבית ופתח משם ⬇️ שתף</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white text-sm font-semibold leading-tight">רוצה להישאר מעודכן?</p>
                        <p className="text-slate-400 text-xs mt-0.5">קבל התראות על משחקים ותוצאות</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {!isIOSBrowser && (
                      <button
                        onClick={async () => {
                          setShowPushBanner(false);
                          localStorage.setItem(bannerKey, 'true');
                          if (window.OneSignal) {
                            try { await window.OneSignal.Notifications.requestPermission(); } catch (e) {}
                          }
                        }}
                        className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                      >
                        הפעל
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowPushBanner(false);
                        if (!isIOSBrowser) localStorage.setItem(bannerKey, 'true');
                      }}
                      className="text-slate-500 text-xs text-center"
                    >
                      {isIOSBrowser ? 'סגור' : 'אחר כך'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </>
    </LayoutGroup>);

}