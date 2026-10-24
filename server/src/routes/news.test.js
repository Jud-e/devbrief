import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { newsRouter } from './news.js';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

const app = express();
app.use('/api/news', newsRouter);

describe('GET /feed', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    it('returns news articles successfully', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                articles: [
                    {
                        title: 'Test Article',
                        description: 'A test article description.',
                        url: 'https://example.com/article',
                        image: 'https://example.com/image.jpg',
                        publishedAt: '2026-09-23T10:00:00Z',
                        source: {
                            name: 'Test Source',
                        },
                    },
                ],
                totalArticles: 1,
            }),
        });

        const response = await request(app)
            .get('/api/news/feed')
            .query({
                category: 'technology',
                pageSize: 10,
            });

        expect(response.status).toBe(200);
        expect(response.body.articles).toHaveLength(1);
        expect(response.body.articles[0].title).toBe('Test Article');
    });
});

it('returns cached results on a second request', async () => {
    mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
            articles: [
                {
                    title: 'Cached Article',
                    description: 'This should only come from GNews once.',
                    url: 'https://example.com/article',
                    image: 'https://example.com/image.jpg',
                    publishedAt: '2026-09-23T10:00:00Z',
                    source: {
                        name: 'Test Source',
                    },
                },
            ],
            totalArticles: 1,
        }),
    });

    const firstResponse = await request(app)
        .get('/api/news/feed')
        .query({
            category: 'cybersecurity',
            pageSize: 10,
        });

    const secondResponse = await request(app)
        .get('/api/news/feed')
        .query({
            category: 'cybersecurity',
            pageSize: 10,
        });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    expect(secondResponse.body.cached).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(1);
});

it('does not use the same cache entry for different page sizes', async () => {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        articles: [
          {
            title: 'Small Page Article',
            description: 'First response.',
            url: 'https://example.com/1',
            image: 'https://example.com/1.jpg',
            publishedAt: '2026-09-25T10:00:00Z',
            source: { name: 'Test Source' },
          },
        ],
        totalArticles: 1,
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        articles: [
          {
            title: 'Large Page Article',
            description: 'Second response.',
            url: 'https://example.com/2',
            image: 'https://example.com/2.jpg',
            publishedAt: '2026-09-25T11:00:00Z',
            source: { name: 'Test Source' },
          },
        ],
        totalArticles: 1,
      }),
    });

  const firstResponse = await request(app)
    .get('/api/news/feed')
    .query({
      category: 'startups',
      pageSize: 10,
    });

  const secondResponse = await request(app)
    .get('/api/news/feed')
    .query({
      category: 'startups',
      pageSize: 20,
    });

  expect(firstResponse.status).toBe(200);
  expect(secondResponse.status).toBe(200);

  expect(secondResponse.body.cached).not.toBe(true);
  expect(mockFetch).toHaveBeenCalledTimes(2);
});

describe('GET /search', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('sends the search query to GNews', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      articles: [],
      totalArticles: 0,
    }),
  });

  await request(app)
    .get('/api/news/search')
    .query({
      q: 'javascript testing',
    });

  expect(mockFetch).toHaveBeenCalledTimes(1);

  const requestedUrl = mockFetch.mock.calls[0][0];

  expect(requestedUrl).toContain('q=javascript%20testing');
  expect(requestedUrl).toContain('sortby=relevance');
  expect(requestedUrl).toContain('max=10');
});

  it('returns 400 when no search query is provided', async () => {
    const response = await request(app)
      .get('/api/news/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Query required',
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns search results successfully', async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      articles: [
        {
          title: 'JavaScript Testing',
          description: 'An article about testing JavaScript applications.',
          url: 'https://example.com/testing',
          image: 'https://example.com/testing.jpg',
          publishedAt: '2026-09-25T10:00:00Z',
          source: {
            name: 'Test Source',
          },
        },
      ],
      totalArticles: 1,
    }),
  });

  const response = await request(app)
    .get('/api/news/search')
    .query({
      q: 'javascript testing',
    });

  expect(response.status).toBe(200);
  expect(response.body.articles).toHaveLength(1);
  expect(response.body.articles[0]).toEqual({
    title: 'JavaScript Testing',
    description: 'An article about testing JavaScript applications.',
    url: 'https://example.com/testing',
    urlToImage: 'https://example.com/testing.jpg',
    publishedAt: '2026-09-25T10:00:00Z',
    source: {
      id: null,
      name: 'Test Source',
    },
    author: 'Test Source',
  });

  expect(response.body.totalResults).toBe(1);
  expect(mockFetch).toHaveBeenCalledTimes(1);
});
});

it('returns 500 when GNews fails', async () => {
  mockFetch.mockRejectedValue(new Error('GNews API unavailable'));

  const response = await request(app)
    .get('/api/news/search')
    .query({
      q: 'javascript',
    });

  expect(response.status).toBe(500);
  expect(response.body).toEqual({
    error: 'Search failed',
    detail: 'GNews API unavailable',
  });

  expect(mockFetch).toHaveBeenCalledTimes(1);
});