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
            category: 'technology',
            pageSize: 10,
        });

    const secondResponse = await request(app)
        .get('/api/news/feed')
        .query({
            category: 'technology',
            pageSize: 10,
        });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    expect(secondResponse.body.cached).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(1);
});