import express from 'express';
import { summarizeArticle } from '../services/ai.js';

export const newsRouter = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_BASE = 'https://gnews.io/api/v4';
console.log('KEY:', process.env.NEWS_API_KEY)
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

// Map category tabs to simple single-keyword queries (no OR operators)
const CATEGORY_QUERIES = {
  technology: 'software',
  'AI': 'artificial intelligence',
  'web development': 'javascript',
  'cloud computing': 'cloud',
  'cybersecurity': 'cybersecurity',
  'open source': 'open source',
  'startups': 'startup',
};

function normalizeArticle(a) {
  return {
    title: a.title,
    description: a.description,
    url: a.url,
    urlToImage: a.image,
    publishedAt: a.publishedAt,
    source: { id: null, name: a.source?.name || 'Unknown' },
    author: a.source?.name || null,
  };
}

async function fetchFromGNews(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GNews ${res.status}: ${body}`);
  }
  return res.json();
}

newsRouter.get('/feed', async (req, res) => {
  const { category = 'technology', pageSize = 10 } = req.query;
  const cacheKey = `feed:${category}`;

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return res.json({ ...data, cached: true });
    }
  }

  try {
    const query = CATEGORY_QUERIES[category] || 'technology';
    const url = `${GNEWS_BASE}/search?q=${encodeURIComponent(query)}&lang=en&sortby=publishedAt&max=${pageSize}&apikey=${NEWS_API_KEY}`;
    const data = await fetchFromGNews(url);
    const articles = (data.articles || []).map(normalizeArticle);

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

    const result = { articles: enriched, totalResults: data.totalArticles || articles.length };
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    console.error('News feed error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news', detail: err.message });
  }
});

newsRouter.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const url = `${GNEWS_BASE}/search?q=${encodeURIComponent(q)}&lang=en&sortby=relevance&max=10&apikey=${NEWS_API_KEY}`;
    const data = await fetchFromGNews(url);
    const articles = (data.articles || []).map(normalizeArticle);
    res.json({ articles, totalResults: data.totalArticles || articles.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', detail: err.message });
  }
});