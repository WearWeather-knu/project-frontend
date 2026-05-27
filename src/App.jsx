import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import ClosetPage from '@/pages/ClosetPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import ComparisonPage from './pages/ComparisonPage';
import HistoryPage from './pages/HistoryPage';
import { useEffect, useState } from 'react';
import { supabase } from './api/auth/supabaseClient';
import PrivateRoute from './components/PrivateRoute';
import { useAuthStore } from './store/AuthStore';
import AppLayout from './components/AppLayout';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';

function App() {
  const { session, setSession } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
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
  }, [setSession]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash || loading) {
    return (
      <MobileFrame>
        <SplashScreen />
      </MobileFrame>
    );
  }

  return (
    <BrowserRouter>
      <MobileFrame>
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
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
          </Route>
        </Routes>
      </MobileFrame>
    </BrowserRouter>
  );
}

export default App;
