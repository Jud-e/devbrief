import { useLocation, Link } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';
import './Search.css';

export function Search() {
  const location = useLocation();
  const { results = [], query = '' } = (location.state || {}) as { results: Article[]; query: string };
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <div className="search-page">
      <div className="search-inner">
        <div className="search-header">
          <Link to="/" className="back-link">← Back to feed</Link>
          <h1 className="search-title">
            Results for <span>"{query}"</span>
          </h1>
          <p className="search-meta">{results.length} articles found</p>
        </div>

        {results.length > 0 ? (
          <div className="search-grid">
            {results.map((article, i) => (
              <ArticleCard
                key={article.url}
                article={article}
                isBookmarked={isBookmarked(article.url)}
                onToggleBookmark={toggleBookmark}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No results found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
