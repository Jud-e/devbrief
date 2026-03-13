import { useState, useEffect } from 'react';
import { Article } from '../types';

const STORAGE_KEY = 'devbrief_bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (url: string) => bookmarks.some(b => b.url === url);

  const toggleBookmark = (article: Article) => {
    setBookmarks(prev =>
      isBookmarked(article.url)
        ? prev.filter(b => b.url !== article.url)
        : [article, ...prev]
    );
  };

  return { bookmarks, isBookmarked, toggleBookmark };
}
