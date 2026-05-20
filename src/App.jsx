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

function App() {
  const { session, setSession } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route element={<PrivateRoute session={session} />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/closet" element={<ClosetPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
