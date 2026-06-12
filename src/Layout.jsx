import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserStats } from "@/api/entities";
import { Settings, LogOut, PlayCircle, Bell, BellOff } from "lucide-react";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false); // NEW: State for YearlySummaryPanel
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [touchEndY, setTouchEndY] = useState(null);
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
        setShowLiveData(false);
      } else if (isLeftSwipe) {
        setShowLiveData(true);
        setShowLeaderboard(false);
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
              height: '60px',
              zIndex: 35,
              background: 'rgba(5,10,20,0.35)',
              backdropFilter: 'blur(28px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        )}

        {/* כפתור המבורגר עם אייקון אסטרטגיה */}
        <div className="fixed top-[38px] left-4 z-40">
          <Button
            variant="ghost"
            onClick={() => setShowSidebar(true)}
            className="p-0 w-[60px] h-[60px] flex items-center justify-center rounded-xl transition-colors hover:bg-slate-700/40 backdrop-blur-sm border-0 bg-transparent shadow-none">

            <img
              src="/football-field.png"
              alt="Menu" className="mb-2 w-full h-full object-contain rounded-lg" />
          </Button>
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
        <div className="fixed top-[38px] right-4 z-40 flex items-center gap-2">

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
          </div>
        }

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
    </>);

}