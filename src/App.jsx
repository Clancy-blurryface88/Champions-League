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
import { AppIntroContext } from '@/lib/AppIntroContext';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// The clip is the 4s used segment of the original intro, cut to fit the screen:
// portrait for phones, landscape for wide screens (~0.45MB instead of 3.3MB).
// It loops while auth is still loading, then lets the app take over. The app
// itself renders underneath meanwhile (see AuthenticatedApp).
const INTRO_END = 3.9; // just before the clip's own end, so it never stops on its last frame
const INTRO_MAX_MS = 9000; // a video that can't play (autoplay blocked, load error) never holds the app longer
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
      {!appReady && (
        <div className="absolute inset-0 flex items-end justify-center pb-10">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [introDone, setIntroDone] = React.useState(false);

  const isLoading = isLoadingPublicSettings || isLoadingAuth;
  const intro = !introDone && <IntroVideo appReady={!isLoading} onDone={() => setIntroDone(true)} />;

  // Until auth is known there is nothing to render under the video yet.
  if (isLoading) return intro || null;

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

  // Render the main app — already underneath the intro video while it plays,
  // so the screen and its data are loading in the meantime.
  return (
    <AppIntroContext.Provider value={introDone}>
    {intro}
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
    </AppIntroContext.Provider>
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
