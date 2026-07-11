import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { User, UserStats, Match, Prediction } from "@/api/entities";
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
import ExactHitsPanel from "./components/ExactHitsPanel";
import IntroVideoModal from "./components/IntroVideoModal";
// This import is kept as per outline
import { createPageUrl } from "@/utils";
import { LoaderBar } from "./components/ui/LoaderBar";
import AppBackground from "./components/AppBackground";
import LiveDataPanel from "./components/LiveDataPanel"; // Added: Import LiveDataPanel
import MatchTickerBar from "./components/MatchTickerBar";
import YearlySummaryPanel from "./components/YearlySummaryPanel"; // NEW: YearlySummaryPanel
import { OdometerDigit } from "./components/OdometerScore";
import MatchCountdown from "./components/MatchCountdown";
import TeamFlag from "./components/TeamFlag";
import LiveLeaderboard from "./components/LiveLeaderboard";

// Measures a ref'd element's rendered box size, updating on resize (the live
// card's width is responsive — min(370px, 92vw) — so the ring's actual
// dimensions aren't known ahead of render).
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
function LiveMatchCard({ liveMatch, liveUserPrediction, liveMatchCount }) {
  const { progress, settledTick } = useLiveMinuteProgress(liveMatch);
  const minute = liveMatch ? Math.floor(progress * 90) : null;
  const homeScore = Math.min(Math.max(Number(liveMatch?.score?.fullTime?.home ?? 0) || 0, 0), 9);
  const awayScore = Math.min(Math.max(Number(liveMatch?.score?.fullTime?.away ?? 0) || 0, 0), 9);
  // Hold the digits at 0 until the ring finishes its reveal — the roll to the
  // real score then plays right as/after the minute settles into place,
  // instead of racing ahead on its own fixed timer.
  const displayHomeScore = settledTick > 0 ? homeScore : 0;
  const displayAwayScore = settledTick > 0 ? awayScore : 0;

  const RING_RADIUS = 20;
  const ringRef = useRef(null);
  const ringSize = useElementSize(ringRef);
  const marker = roundedRectEdgePoint(progress * 360, ringSize.width / 2, ringSize.height / 2, RING_RADIUS);

  return (
    <motion.div
      ref={ringRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{
        scale: 0.15, x: '38vw', y: '-42vh', opacity: 0,
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      className="rounded-2xl"
      style={{
        position: 'relative',
        padding: 2.5,
        borderRadius: RING_RADIUS,
        maxWidth: 'min(370px, 92vw)',
        background: `conic-gradient(from 0deg, #ef4444 ${progress * 360}deg, rgba(255,255,255,0.08) ${progress * 360}deg 360deg)`,
        boxShadow: '0 0 30px rgba(239,68,68,0.2)',
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
            background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11,
            borderRadius: 999, padding: '2px 7px', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #030d1a',
            zIndex: 5,
          }}
        >
          {minute}'
        </motion.div>
      )}
      <div
        className="rounded-2xl"
        style={{
          background: 'rgba(8,18,32,0.95)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 0 60px rgba(239,68,68,0.18), 0 20px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
            <div className="px-6 py-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Live</span>
              </div>
              {liveMatch && (
                <div className="flex flex-col items-center gap-1">
                  {/* Flags flank the score directly, vertically centered on the digits (the
                      team-code label is absolutely positioned so it doesn't push the flag
                      itself up relative to the shorter digit boxes) */}
                  <div className="flex items-center gap-3" dir="ltr">
                    <div className="relative flex flex-col items-center">
                      <TeamFlag logo={liveMatch.homeTeam?.crest} name={liveMatch.homeTeam?.name} className="w-12 h-12" animate={false} />
                      <span className="absolute top-full mt-1 text-slate-400 text-[10px] whitespace-nowrap">{liveMatch.homeTeam?.tla}</span>
                    </div>
                    <div style={{ width: 34, height: 50, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: 42, height: 64 }}>
                        <OdometerDigit target={displayHomeScore} delayMs={150} />
                      </div>
                    </div>
                    <span style={{ color: '#475569', fontSize: 34, fontWeight: 900 }}>-</span>
                    <div style={{ width: 34, height: 50, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: 42, height: 64 }}>
                        <OdometerDigit target={displayAwayScore} delayMs={400} />
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <TeamFlag logo={liveMatch.awayTeam?.crest} name={liveMatch.awayTeam?.name} className="w-12 h-12" animate={false} />
                      <span className="absolute top-full mt-1 text-slate-400 text-[10px] whitespace-nowrap">{liveMatch.awayTeam?.tla}</span>
                    </div>
                  </div>
                  {liveUserPrediction && (
                    <div className="flex flex-col items-center gap-1 mt-2">
                      <span className="text-slate-400 text-xs">הניחוש שלי</span>
                      <span className="text-amber-400 text-sm font-bold" dir="ltr">
                        ({liveUserPrediction.predicted_score_a} - {liveUserPrediction.predicted_score_b})
                      </span>
                    </div>
                  )}
                </div>
              )}
              {liveMatchCount > 1 && (
                <span className="text-slate-400 text-xs">+{liveMatchCount - 1} משחקים נוספים</span>
              )}
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showIntroVideoModal, setShowIntroVideoModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [showExactHits, setShowExactHits] = useState(false); // Kept, but its functionality is replaced for swipe
  const [showLiveData, setShowLiveData] = useState(false); // Added: New state for LiveDataPanel
  const [hasLiveMatch, setHasLiveMatch] = useState(false);
  const [liveMatch, setLiveMatch] = useState(null);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [showLiveIntro, setShowLiveIntro] = useState(false);
  const [showLiveLeaderboard, setShowLiveLeaderboard] = useState(false);
  const [liveUserPrediction, setLiveUserPrediction] = useState(null);
  const [livePredictionLoading, setLivePredictionLoading] = useState(false);
  const [liveCheckDone, setLiveCheckDone] = useState(false);
  const [nextMatch, setNextMatch] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [nextMatchIndex, setNextMatchIndex] = useState(0);
  const [nextMatchChecked, setNextMatchChecked] = useState(false);
  const [showNextMatchIntro, setShowNextMatchIntro] = useState(false);
  const [nextMatchPrediction, setNextMatchPrediction] = useState(null);
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

          // CRITICAL: בדיקת has_seen_intro_video מישות User (לא UserStats)
          userWithStats.has_seen_intro_video = currentUser.has_seen_intro_video || false;
          console.log("🎬 Layout checkAuth - has_seen_intro_video:", userWithStats.has_seen_intro_video);
        } else {
          userWithStats = null;
        }

        setUser(userWithStats);

        // פלואו אונבורדינג: WelcomeModal → סרטון → דשבורד
        if (currentUser) {
          const hasCompletedWelcome = localStorage.getItem('welcome_completed_' + currentUser.id) === 'true';
          const hasSeenVideo = userWithStats.has_seen_intro_video ||
            localStorage.getItem('intro_seen_' + currentUser.id) === 'true';
          if (!hasCompletedWelcome) {
            setShowWelcomeModal(true);
          } else if (!hasSeenVideo) {
            setShowIntroVideoModal(true);
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
              has_seen_intro_video: false,
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
        const res = await fetch(`/api/football?competition=WC&filter=LIVE&dateFrom=${prevLocalDate}&dateTo=${localDate}`);
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
  // check is still in flight.
  useEffect(() => {
    if (authLoading || !liveCheckDone || !nextMatchChecked) return;
    if (hasLiveMatch && livePredictionLoading) return; // wait so the card appears complete, prediction included
    if (sessionStorage.getItem('match_intro_shown')) return;
    sessionStorage.setItem('match_intro_shown', '1');
    if (hasLiveMatch) {
      setShowLiveIntro(true);
    } else if (nextMatch) {
      setShowNextMatchIntro(true);
    }
  }, [authLoading, liveCheckDone, nextMatchChecked, hasLiveMatch, nextMatch, livePredictionLoading]);

  // Cycle through every known upcoming match once (zoom-through transition),
  // then auto-dismiss — this overlay blocks the rest of the UI while open,
  // same as it always has, so it always ends on its own rather than looping
  // forever with no way to close it. The first card gets extra settled time
  // since it's the very first thing the user reads.
  const NEXT_MATCH_CARD_MS = 4000;       // 3.5s settled + 0.5s transition
  const NEXT_MATCH_FIRST_CARD_MS = 4500; // 4s settled + 0.5s transition
  useEffect(() => {
    if (!showNextMatchIntro) return;
    setNextMatchIndex(0);
    if (upcomingMatches.length <= 1) {
      const t = setTimeout(() => setShowNextMatchIntro(false), 8000);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    let timer;
    const advance = (i) => {
      const delay = i === 0 ? NEXT_MATCH_FIRST_CARD_MS : NEXT_MATCH_CARD_MS;
      timer = setTimeout(() => {
        if (cancelled) return;
        if (i + 1 >= upcomingMatches.length) {
          setShowNextMatchIntro(false);
          return;
        }
        setNextMatchIndex(i + 1);
        advance(i + 1);
      }, delay);
    };
    advance(0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [showNextMatchIntro, upcomingMatches.length]);

  // Fetch the user's own prediction for whichever match is currently shown
  // in the cycle (already our DB match — no name matching needed).
  useEffect(() => {
    const current = upcomingMatches[nextMatchIndex];
    if (!current?.id || !user?.id) { setNextMatchPrediction(null); return; }
    let cancelled = false;
    Prediction.filter({ match_id: current.id, user_id: user.id })
      .then((preds) => { if (!cancelled) setNextMatchPrediction(preds.length > 0 ? preds[0] : null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [upcomingMatches, nextMatchIndex, user?.id]);

  // Fetch user prediction for the live match
  useEffect(() => {
    if (!liveMatch || !user?.id) { setLivePredictionLoading(false); return; }
    let cancelled = false;
    setLivePredictionLoading(true);
    setLiveUserPrediction(null);
    const fetchLivePrediction = async () => {
      try {
        const allMatches = await Match.list();
        const apiHome = (liveMatch.homeTeam?.name || '').toLowerCase();
        const apiAway = (liveMatch.awayTeam?.name || '').toLowerCase();
        const supabaseMatch = allMatches.find(m => {
          const a = (m.team_a || '').toLowerCase();
          const b = (m.team_b || '').toLowerCase();
          const homeMatch = apiHome.includes(a.slice(0, 4)) || a.includes(apiHome.slice(0, 4));
          const awayMatch = apiAway.includes(b.slice(0, 4)) || b.includes(apiAway.slice(0, 4));
          return homeMatch && awayMatch;
        });
        if (supabaseMatch) {
          const preds = await Prediction.filter({ match_id: supabaseMatch.id, user_id: user.id });
          if (preds.length > 0 && !cancelled) setLiveUserPrediction(preds[0]);
        }
      } catch {
        // no prediction to show — overlay still proceeds with just the live score
      } finally {
        if (!cancelled) setLivePredictionLoading(false);
      }
    };
    fetchLivePrediction();
    return () => { cancelled = true; };
  }, [liveMatch?.homeTeam?.name, user?.id]);

  // Auto-dismiss the live intro — but only start the countdown once we know
  // whether there's a prediction to show, so it never disappears mid-fetch.
  useEffect(() => {
    if (!showLiveIntro || livePredictionLoading) return;
    const t = setTimeout(() => setShowLiveIntro(false), 7000);
    return () => clearTimeout(t);
  }, [showLiveIntro, livePredictionLoading]);

  // Hard safety cap — never let the overlay block the UI indefinitely even
  // if the prediction fetch hangs.
  useEffect(() => {
    if (!showLiveIntro) return;
    const cap = setTimeout(() => setShowLiveIntro(false), 16000);
    return () => clearTimeout(cap);
  }, [showLiveIntro]);

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
      const upcoming = all
        .filter(m => !m.is_finished && new Date(m.match_date) > now)
        .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
      setNextMatch(upcoming[0] || null);
      setUpcomingMatches(upcoming);
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

    const hasSeenVideo = user?.has_seen_intro_video ||
      localStorage.getItem('intro_seen_' + user?.id) === 'true';
    if (!hasSeenVideo) {
      setShowIntroVideoModal(true);
    } else {
      navigate(createPageUrl("Dashboard"));
    }
  };

  // לוגיקה חדשה: נקראת לאחר שהסרטון הסתיים או דולג
  const handleIntroVideoCompleted = async () => {
    setShowIntroVideoModal(false);
    // שמור תמיד ב-localStorage כגיבוי
    try { localStorage.setItem('intro_seen_' + (user?.id || 'guest'), 'true'); } catch {}
    try {
      await User.updateMyUserData({ has_seen_intro_video: true });
      setUser((prev) => ({ ...prev, has_seen_intro_video: true }));
    } catch (error) {
      console.error("❌ Failed to update intro video status:", error);
    }
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
                  border: '1.5px solid rgba(245,197,24,0.5)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              >
                <span className="text-xl select-none">🏟️</span>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center shadow-md"
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

                  {/* Knockout Bracket Card - קלף חמישי - ברוחב מלא */}
                  <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.25
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(createPageUrl("KnockoutBracket"));
                    setShowSidebar(false);
                  }}
                  className="col-span-2 inline-flex animate-shine items-center justify-center rounded-xl text-sm border border-yellow-500/30 bg-[linear-gradient(110deg,rgba(0,1,3,0.7),45%,rgba(30,38,49,0.9),55%,rgba(0,1,3,0.7))] bg-[length:200%_100%] px-6 py-4 font-medium text-neutral-400 transition-colors cursor-pointer hover:scale-[1.02] gap-4 h-20">

                    <span className="text-3xl shrink-0">🏆</span>
                    <div className="text-right">
                      <h3 className="text-white text-base font-semibold leading-tight">שלבי הכרעה</h3>
                    </div>
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
                      border: '1px solid rgba(245,197,24,0.35)',
                      backdropFilter: 'blur(28px) saturate(1.6)',
                      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8e94debbc_ssmvtnogc7ue0jufjd03h6mj89.png"
                      alt="User Profile"
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      style={{ boxShadow: '0 0 0 2px #f5c518' }}
                    />
                    <span
                      className="text-amber-400 text-sm font-semibold"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {user.display_name || user.full_name}
                    </span>
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
              className="shadow-2xl rounded-2xl min-w-[180px]"
              style={{ background: 'rgba(8,22,45,0.96)', border: '1px solid rgba(245,197,24,0.25)', backdropFilter: 'blur(20px)' }}>

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
                    className="cursor-pointer text-white hover:text-amber-300 hover:bg-slate-700/60 focus:bg-slate-700/60 focus:text-amber-300 rounded-md px-3 py-2 flex items-center gap-3 transition-all duration-300 font-medium">

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

            <AnimatePresence>
              {hasLiveMatch && !showLiveIntro && (location.pathname === '/' || location.pathname.includes('Dashboard')) && (
                <motion.button
                  layoutId="live-chip"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                  onClick={() => { setShowLiveData(true); setShowLeaderboard(false); }}
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
          </div>
        }

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
              />
              <div className="fixed inset-0 z-[56] flex items-center justify-center pointer-events-none">
                <LiveMatchCard
                  liveMatch={liveMatch}
                  liveUserPrediction={liveUserPrediction}
                  liveMatchCount={liveMatchCount}
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

        {/* Next Match Intro Overlay — shown once per session when there's no live
            match; cycles (zoom-through) through every known upcoming match. */}
        <AnimatePresence>
          {showNextMatchIntro && (upcomingMatches[nextMatchIndex] || nextMatch) && (() => {
            const currentMatch = upcomingMatches[nextMatchIndex] || nextMatch;
            return (
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
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(8,18,32,0.95)',
                    border: '1px solid rgba(245,197,24,0.4)',
                    backdropFilter: 'blur(28px)',
                    boxShadow: '0 0 60px rgba(245,197,24,0.15), 0 20px 60px rgba(0,0,0,0.7)',
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={nextMatchIndex}
                      initial={{ opacity: 0, scale: 0.5, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.6, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="px-10 py-8 flex flex-col items-center gap-5"
                    >
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.35)' }}>
                        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">המשחק הבא</span>
                      </div>

                      <div className="flex items-center gap-6" dir="ltr">
                        <div className="flex flex-col items-center gap-1.5 w-20">
                          <TeamFlag logo={currentMatch.team_a_logo} name={currentMatch.team_a} className="w-14 h-14" animate={false} />
                          <span className="text-slate-400 text-[11px] text-center">{currentMatch.team_a}</span>
                        </div>
                        <span className="text-slate-500 font-bold text-sm">VS</span>
                        <div className="flex flex-col items-center gap-1.5 w-20">
                          <TeamFlag logo={currentMatch.team_b_logo} name={currentMatch.team_b} className="w-14 h-14" animate={false} />
                          <span className="text-slate-400 text-[11px] text-center">{currentMatch.team_b}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-slate-400 text-[11px] tracking-wide">
                          {new Date(currentMatch.match_date).toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                        </span>
                        <span className="text-white text-xl font-black" dir="ltr">
                          {new Date(currentMatch.match_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <MatchCountdown target={currentMatch.match_date} />

                      {nextMatchPrediction && (
                        <div className="flex flex-col items-center gap-1 mt-1">
                          <span className="text-slate-400 text-xs">הניחוש שלי</span>
                          <span className="text-amber-400 text-sm font-bold">
                            ({nextMatchPrediction.predicted_score_a} - {nextMatchPrediction.predicted_score_b})
                          </span>
                        </div>
                      )}

                      {upcomingMatches.length > 1 && (
                        <span className="text-slate-600 text-[10px] tracking-wide" dir="ltr">
                          {nextMatchIndex + 1} / {upcomingMatches.length}
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </>
            );
          })()}
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

        <IntroVideoModal
          isOpen={showIntroVideoModal}
          onVideoCompleted={handleIntroVideoCompleted} />

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

        {/* Push Notification Banner */}
        <AnimatePresence>
          {showPushBanner && (() => {
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