import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import { ArticleCard } from '../components/ArticleCard';
import './Feed.css';

const CATEGORIES = [
  { id: 'technology', label: 'All Tech' },
  { id: 'AI', label: 'AI & ML' },
  { id: 'web development', label: 'Web Dev' },
  { id: 'cloud computing', label: 'Cloud' },
  { id: 'cybersecurity', label: 'Security' },
  { id: 'open source', label: 'Open Source' },
  { id: 'startups', label: 'Startups' },
];

export function Feed() {
  const [category, setCategory] = useState('technology');
  const { articles, loading, error, hasMore, loadMore } = useNews(category);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="feed-header-inner">
          <div className="feed-headline">
            <span className="feed-eyebrow">Tech News · AI Distilled</span>
            <h1 className="feed-title">Your engineering<br />briefing, curated.</h1>
            <p className="feed-sub">
              Real-time tech news with AI summaries, tags, and sentiment —
              so you can stay sharp without the scroll.
            </p>
          </div>
          <div className="feed-stats">
            <div className="stat">
              <span className="stat-num">{articles.length}</span>
              <span className="stat-label">articles loaded</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num" style={{ color: 'var(--accent)' }}>AI</span>
              <span className="stat-label">summarized</span>
            </div>
          </div>
        </div>
      </header>

      <div className="feed-controls">
        <div className="feed-controls-inner">
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`cat-tab ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="feed-main">
        {error && (
          <div className="error-state">
            <span>⚠</span>
            <p>{error}</p>
            <p className="error-hint">Make sure your NEWS_API_KEY is set in the server .env file.</p>
          </div>
        )}

        {!error && (
          <div className="articles-grid">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.url}
                article={article}
                isBookmarked={isBookmarked(article.url)}
                onToggleBookmark={toggleBookmark}
                style={{ animationDelay: `${(i % 12) * 50}ms` }}
              />
            ))}

            {loading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-skeleton" />
                ))}
              </>
            )}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="load-more">
            <button className="btn-load-more" onClick={loadMore}>
              Load more articles
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <span>⬡</span>
            <p>No articles found for this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
