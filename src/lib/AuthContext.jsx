import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({ id: 'default' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoadingAuth(false);
    });

    // Ties this device's push subscription to the user (OneSignal external_id
    // = Supabase user id), so the admin panel can show who is subscribed.
    // Runs once the SDK has loaded (OneSignalDeferred queue).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoadingAuth(false);
      if (session && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
        window.OneSignalDeferred?.push((OneSignal) => OneSignal.login(session.user.id).catch((e) => console.warn('[OneSignal.login]', e)));
      } else if (event === 'SIGNED_OUT') {
        window.OneSignalDeferred?.push((OneSignal) => OneSignal.logout().catch((e) => console.warn('[OneSignal.logout]', e)));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState: () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
