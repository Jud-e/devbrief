import { useState } from 'react';
import { Article } from '../types';
import './ArticleCard.css';

interface Props {
  article: Article;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
  style?: React.CSSProperties;
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#6ee7b7',
  neutral: '#8888aa',
  negative: '#f87171',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '● Beginner',
  intermediate: '●● Mid',
  advanced: '●●● Advanced',
};

export function ArticleCard({ article, isBookmarked, onToggleBookmark, style }: Props) {
  const [imgError, setImgError] = useState(false);
  const timeAgo = getTimeAgo(article.publishedAt);
  const sentiment = article.ai?.sentiment || 'neutral';
  const tags = article.ai?.tags || [];
  const summary = article.ai?.summary || article.description || '';
  const difficulty = article.ai?.difficulty || 'intermediate';

  return (
    <article className="card animate-fade-up" style={style}>
      {article.urlToImage && !imgError && (
        <div className="card-image">
          <img
            src={article.urlToImage}
            alt={article.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="card-image-overlay" />
        </div>
      )}

      <div className="card-body">
        <div className="card-meta">
          <span className="card-source">{article.source.name}</span>
          <span className="card-dot">·</span>
          <span className="card-time">{timeAgo}</span>
          <span className="card-dot">·</span>
          <span className="card-difficulty">{DIFFICULTY_LABELS[difficulty]}</span>
        </div>

        <h2 className="card-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h2>

        {summary && (
          <div className="card-summary">
            <span className="summary-label">AI Summary</span>
            <p>{summary}</p>
          </div>
        )}

        <div className="card-footer">
          <div className="card-tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            <span
              className="sentiment-dot"
              style={{ color: SENTIMENT_COLORS[sentiment] }}
              title={`Sentiment: ${sentiment}`}
            >
              ◆
            </span>
          </div>

          <div className="card-actions">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-read"
            >
              Read →
            </a>
            <button
              className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => onToggleBookmark(article)}
              title={isBookmarked ? 'Remove bookmark' : 'Save article'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
