import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { NewsResponse } from '../types';
import './Navbar.css';

interface Props {
  bookmarkCount: number;
}

export function Navbar({ bookmarkCount }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await api.get<NewsResponse>(`/news/search?q=${encodeURIComponent(query)}`);
      navigate('/search', { state: { results: data.articles, query } });
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">DevBrief</span>
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          {searching && <div className="spinner" style={{ width: 14, height: 14 }} />}
        </form>

        <div className="navbar-right">
          <Link to="/bookmarks" className="nav-bookmarks">
            <span>★</span>
            <span className="nav-label">Saved</span>
            {bookmarkCount > 0 && (
              <span className="bookmark-badge">{bookmarkCount}</span>
            )}
          </Link>

          {user ? (
            <div className="nav-user">
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-logout">Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="btn-signin">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
