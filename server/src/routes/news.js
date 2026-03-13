import express from 'express';
import { summarizeArticle } from '../services/ai.js';

export const newsRouter = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE = 'https://newsapi.org/v2';

// Cache to avoid hammering APIs
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchFromNewsAPI(url) {
  const res = await fetch(url, {
    headers: { 'X-Api-Key': NEWS_API_KEY }
  });
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
  return res.json();
}

newsRouter.get('/feed', async (req, res) => {
  const { category = 'technology', page = 1, pageSize = 12 } = req.query;
  const cacheKey = `feed:${category}:${page}`;

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return res.json({ ...data, cached: true });
    }
  }

  try {
    const rawQuery = category === 'technology'
      ? 'technology OR programming OR software OR AI'
      : category;

    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(rawQuery)}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}`;
    const data = await fetchFromNewsAPI(url);

    const articles = (data.articles || []).filter(a => a.title && a.title !== '[Removed]');

    // Enrich top 6 articles with AI summaries (rate limit conscious)
    const enriched = await Promise.all(
      articles.map(async (article, i) => {
        if (i < 6 && process.env.ANTHROPIC_API_KEY) {
          const ai = await summarizeArticle(article);
          return { ...article, ai };
        }
        return {
          ...article,
          ai: {
            summary: article.description || 'Read the full article for details.',
            tags: ['Tech'],
            difficulty: 'intermediate',
            sentiment: 'neutral',
          }
        };
      })
    );

    const result = { articles: enriched, totalResults: data.totalResults };
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    console.error('News feed error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news', detail: err.message });
  }
});

newsRouter.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&language=en&sortBy=relevancy&page=${page}&pageSize=12`;
    const data = await fetchFromNewsAPI(url);
    const articles = (data.articles || []).filter(a => a.title && a.title !== '[Removed]');
    res.json({ articles, totalResults: data.totalResults });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', detail: err.message });
  }
});
