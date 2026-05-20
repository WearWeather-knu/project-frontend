import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import ClosetPage from '@/pages/ClosetPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from './api/auth/supabaseClient';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <MobileFrame>
        <SplashScreen />
      </MobileFrame>
    );
  }

  return (
    <BrowserRouter>
      <MobileFrame>
        <SplashScreen />
        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route element={<PrivateRoute session={session} />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/closet" element={<ClosetPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </MobileFrame>
    </BrowserRouter>
  );
}

export default App;
