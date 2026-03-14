import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useBookmarks } from './hooks/useBookmarks';
import { Navbar } from './components/Navbar';
import { Feed } from './pages/Feed';
import { Bookmarks } from './pages/Bookmarks';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { useState, useEffect } from 'react';
import './App.css';

function WakingUp() {
  return (
    <div className="wakeup-screen">
      <div className="wakeup-spinner" />
      <h2 className="wakeup-title">Waking up the server...</h2>
      <p className="wakeup-sub">
        The demo server spins down when idle.<br />
        It'll be ready in about 30 seconds — hang tight.
      </p>
      <span className="wakeup-badge">⬡ DevBrief is starting</span>
    </div>
  );
}

function AppInner() {
  const { bookmarks } = useBookmarks();
  const [serverReady, setServerReady] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const healthUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/health`
      : '/api/health';

    const timeout = setTimeout(() => setServerReady(false), 3000);

    fetch(healthUrl)
      .then(res => {
        if (res.ok) {
          clearTimeout(timeout);
          setServerReady(true);
          setChecking(false);
        }
      })
      .catch(() => {
        setServerReady(false);
        setChecking(false);
        const interval = setInterval(() => {
          fetch(healthUrl).then(res => {
            if (res.ok) {
              clearInterval(interval);
              setServerReady(true);
            }
          }).catch(() => {});
        }, 5000);
      });

    return () => clearTimeout(timeout);
  }, []);

  if (!serverReady && !checking) return <WakingUp />;

  return (
    <>
      <Navbar bookmarkCount={bookmarks.length} />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}