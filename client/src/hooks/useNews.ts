import { useState, useEffect, useCallback } from 'react';
import { Article, NewsResponse } from '../types';
import { api } from '../utils/api';

export function useNews(category: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<NewsResponse>(
        `/news/feed?category=${encodeURIComponent(category)}&page=${pageNum}&pageSize=12`
      );
      setArticles(prev => reset ? data.articles : [...prev, ...data.articles]);
      setHasMore(data.articles.length === 12);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    setPage(1);
    fetchNews(1, true);
  }, [category, fetchNews]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNews(next);
  };

  return { articles, loading, error, hasMore, loadMore };
}
