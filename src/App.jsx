import React from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// The clip is a 3s segment of the original intro, cut to fit the screen:
// portrait for phones, landscape for wide screens (~0.4MB instead of 3.3MB).
// It plays clean (nothing drawn over it) and loops while auth is still
// loading; the app renders only once it has finished.
const INTRO_END = 2.2; // cut the 3s clip short — the intro plays for 2.2s
const INTRO_MAX_MS = 9000; // a video that can't play (autoplay blocked, load error) never holds the app longer
const PRELOAD_IMAGES = ['/champions/ch-logo.png', '/champions/ch-trophy.webp', '/champions/match-card-bg-2.webp', '/champions/match-card-bg-3.webp'];
const introSrc = () => (window.innerWidth < window.innerHeight ? '/champions/intro-portrait.mp4' : '/champions/intro-landscape.mp4');

const IntroVideo = ({ appReady, onDone }) => {
  const [src] = React.useState(introSrc);
  const doneRef = React.useRef(false);
  const appReadyRef = React.useRef(appReady);
  appReadyRef.current = appReady;

  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone(); } };
  // end of a pass: hand over if the app is ready, otherwise play the clip again
  const passEnded = (video) => {
    if (appReadyRef.current) { video.pause(); finish(); return; }
    try { video.currentTime = 0; video.play(); } catch {}
  };

  React.useEffect(() => {
    const t = setTimeout(() => { if (appReadyRef.current) finish(); }, INTRO_MAX_MS);
    return () => clearTimeout(t);
  }, []);
  // fetch the first screens' big images while the clip plays, so they're
  // already there when the app appears
  React.useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);
  // past the time cap and the app just became ready → go
  const startRef = React.useRef(Date.now());
  const failedRef = React.useRef(false);
  React.useEffect(() => {
    if (appReady && (failedRef.current || Date.now() - startRef.current > INTRO_MAX_MS)) finish();
  }, [appReady]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      <video
        src={src}
        autoPlay muted playsInline
        onTimeUpdate={(e) => { if (e.currentTarget.currentTime >= INTRO_END) passEnded(e.currentTarget); }}
        onEnded={(e) => passEnded(e.currentTarget)}
        onError={() => { failedRef.current = true; if (appReadyRef.current) finish(); }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [introDone, setIntroDone] = React.useState(false);

  const isLoading = isLoadingPublicSettings || isLoadingAuth;

  // The intro plays on its own; the app loads after it.
  if (!introDone) return <IntroVideo appReady={!isLoading} onDone={() => setIntroDone(true)} />;

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app (Admin and MyStats load on demand — LoadingScreen while they do)
  return (
    <React.Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </React.Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
