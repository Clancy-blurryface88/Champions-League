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

// Plays only the 2s–6s segment of the source clip, looping that segment while
// the app is still loading, then letting it finish once appReady flips true.
const INTRO_START = 2;
const INTRO_END = 6;

const IntroVideo = ({ appReady, onDone }) => {
  const videoRef = React.useRef(null);
  const doneRef = React.useRef(false);

  const seekToStart = (video) => {
    try { video.currentTime = INTRO_START; } catch {}
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      <video
        ref={videoRef}
        src="/champions/intro.mp4"
        autoPlay muted playsInline
        onLoadedMetadata={(e) => seekToStart(e.currentTarget)}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.currentTime < INTRO_END) return;
          if (appReady && !doneRef.current) {
            doneRef.current = true;
            video.pause();
            onDone();
          } else {
            seekToStart(video);
          }
        }}
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

  if (!introDone) {
    return <IntroVideo appReady={!isLoading} onDone={() => setIntroDone(true)} />;
  }

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

  // Render the main app
  return (
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
