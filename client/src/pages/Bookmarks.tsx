import { useBookmarks } from '../hooks/useBookmarks';
import { ArticleCard } from '../components/ArticleCard';
import { Link } from 'react-router-dom';
import './Bookmarks.css';

export function Bookmarks() {
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-inner">
        <div className="bookmarks-header">
          <div>
            <span className="bookmarks-eyebrow">Your reading list</span>
            <h1 className="bookmarks-title">Saved Articles</h1>
          </div>
          <div className="bookmarks-count">
            <span>{bookmarks.length}</span>
            <span>saved</span>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bookmarks-empty">
            <div className="empty-icon">★</div>
            <h2>Nothing saved yet</h2>
            <p>Star articles from the feed to build your reading list.</p>
            <Link to="/" className="btn-browse">Browse articles →</Link>
          </div>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((article, i) => (
              <ArticleCard
                key={article.url}
                article={article}
                isBookmarked={isBookmarked(article.url)}
                onToggleBookmark={toggleBookmark}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
