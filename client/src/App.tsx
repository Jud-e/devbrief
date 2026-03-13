import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useBookmarks } from './hooks/useBookmarks';
import { Navbar } from './components/Navbar';
import { Feed } from './pages/Feed';
import { Bookmarks } from './pages/Bookmarks';
import { Login } from './pages/Login';
import { Search } from './pages/Search';

function AppInner() {
  const { bookmarks } = useBookmarks();

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
