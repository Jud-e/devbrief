import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import './Feed.css';

const CATEGORIES = [
  { id: 'technology', label: 'All' },
  { id: 'AI', label: 'AI & ML' },
  { id: 'web development', label: 'Web Dev' },
  { id: 'cloud computing', label: 'Cloud' },
  { id: 'cybersecurity', label: 'Security' },
  { id: 'open source', label: 'Open Source' },
  { id: 'startups', label: 'Startups' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function Feed() {
  const [category, setCategory] = useState('technology');
  const { articles, loading, error } = useNews(category);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const hero = articles[0] ?? null;
  const sidebar = articles.slice(1, 6);
  const bottom = articles.slice(6, 9);

  return (
    <div className="feed-page">
      <div className="feed-nav">
        <div className="feed-nav-inner">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`feed-pill ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="feed-error">
          <span>⚠</span>
          <p>{error}</p>
          <p className="feed-error-hint">Check your NEWS_API_KEY in server/.env</p>
        </div>
      )}

      {loading && !error && (
        <div className="feed-body">
          <div className="hero-skeleton" />
          <div className="sidebar-skeleton">
            {[...Array(5)].map((_, i) => <div key={i} className="sitem-skeleton" />)}
          </div>
        </div>
      )}

      {!loading && !error && hero && (
        <>
          <div className="feed-body">
            {/* Hero — full bleed image with gradient overlay */}
            <a
              href={hero.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero"
              style={hero.urlToImage ? {
                backgroundImage: `url(${hero.urlToImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              <div className="hero-overlay" />
              <div className="hero-content">
                <div className="hero-label">Featured</div>
                <div className="hero-cat">{hero.ai?.tags?.[0] ?? 'Tech'}</div>
                <h1 className="hero-title">{hero.title}</h1>
                <div className="hero-summary">
                  <div className="hero-summary-label">AI Summary</div>
                  <p>{hero.ai?.summary ?? hero.description}</p>
                </div>
                <div className="hero-tags">
                  {(hero.ai?.tags ?? []).map(tag => (
                    <span key={tag} className="hero-tag">#{tag}</span>
                  ))}
                </div>
                <div className="hero-read">Read article →</div>
                <div className="hero-meta">
                  {hero.source.name} · {timeAgo(hero.publishedAt)} · {hero.ai?.difficulty ?? 'intermediate'}
                </div>
              </div>
            </a>

            {/* Sidebar */}
            <div className="feed-sidebar">
              <div className="sidebar-head">Latest</div>
              {sidebar.map(article => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sitem"
                >
                  {article.urlToImage && (
                    <div
                      className="sitem-img"
                      style={{ backgroundImage: `url(${article.urlToImage})` }}
                    >
                      <div className="sitem-img-overlay" />
                    </div>
                  )}
                  <div className="sitem-inner">
                    <div className="sitem-cat">{article.ai?.tags?.[0] ?? 'Tech'}</div>
                    <div className="sitem-title">{article.title}</div>
                    <div className="sitem-time">{timeAgo(article.publishedAt)}</div>
                  </div>
                  <button
                    className={`sitem-star ${isBookmarked(article.url) ? 'saved' : ''}`}
                    onClick={e => { e.preventDefault(); toggleBookmark(article); }}
                  >
                    {isBookmarked(article.url) ? '★' : '☆'}
                  </button>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom strip */}
          {bottom.length > 0 && (
            <div className="feed-bottom">
              {bottom.map(article => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bitem"
                >
                  {article.urlToImage && (
                    <div
                      className="bitem-img"
                      style={{ backgroundImage: `url(${article.urlToImage})` }}
                    >
                      <div className="bitem-img-overlay" />
                    </div>
                  )}
                  <div className="bitem-body">
                    <div className="bitem-divider" />
                    <div className="bitem-cat">{article.ai?.tags?.[0] ?? 'Tech'}</div>
                    <div className="bitem-title">{article.title}</div>
                    <div className="bitem-time">{timeAgo(article.publishedAt)}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="feed-empty">
          <p>No articles found for this category.</p>
        </div>
      )}
    </div>
  );
}