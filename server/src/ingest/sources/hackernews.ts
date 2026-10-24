import type { SourceFetcher, RawArticle } from "../types";

export const hackerNews: SourceFetcher = {
  name: "Hacker News",
  async fetchNew(since) {
    const params = new URLSearchParams({
      tags: "story",
      numericFilters: `created_at_i>${Math.floor(since.getTime() / 1000)},points>=20`,
      hitsPerPage: "50",
    });
    const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?${params}`);
    if (!res.ok) throw new Error(`HN fetch failed: ${res.status}`);
    const data = (await res.json()) as { hits: any[] };
    return data.hits
      .filter((h) => h.url && h.title)
      .map((h): RawArticle => ({
        externalId: String(h.objectID),
        url: h.url,
        title: h.title,
        publishedAt: new Date(h.created_at_i * 1000),
      }));
  },
};