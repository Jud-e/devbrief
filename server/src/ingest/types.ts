// types.ts
export interface RawArticle {
  externalId: string;
  url: string;
  title: string;
  snippet?: string; // from the feed description, trimmed to 500 chars
  publishedAt: Date;
}

export interface SourceFetcher {
  name: string; // must match a row in Source.name
  fetchNew(since: Date): Promise<RawArticle[]>;
}