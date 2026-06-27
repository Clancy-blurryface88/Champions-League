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

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [introDone, setIntroDone] = React.useState(false);
  const [fadingOut, setFadingOut] = React.useState(false);
  const [loopVideo, setLoopVideo] = React.useState(true);

  const isLoading = isLoadingPublicSettings || isLoadingAuth;

  React.useEffect(() => {
    if (!isLoading && !introDone) setLoopVideo(false);
  }, [isLoading, introDone]);

  const handleVideoEnd = React.useCallback(() => {
    setFadingOut(true);
    setTimeout(() => setIntroDone(true), 600);
  }, []);

  const renderApp = () => {
    if (authError) {
      if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
      if (authError.type === 'auth_required') { navigateToLogin(); return null; }
    }
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

  return (
    <>
      {!isLoading && renderApp()}

      {!introDone && (
        <div
          className="fixed inset-0 bg-black overflow-hidden"
          style={{
            zIndex: 9999,
            opacity: fadingOut ? 0 : 1,
            transition: fadingOut ? 'opacity 0.6s ease' : 'none',
            pointerEvents: fadingOut ? 'none' : 'auto',
          }}
        >
          <video
            src="/wc2026-bumper.mp4"
            autoPlay
            muted
            playsInline
            loop={loopVideo}
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
    </>
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
