import type { PrismaClient } from "@prisma/client";
import type { SourceFetcher } from "./types";
import { canonicalUrl } from "./canonical";

export async function ingestSource(prisma: PrismaClient, fetcher: SourceFetcher) {
  const source = await prisma.source.findUniqueOrThrow({ where: { name: fetcher.name } });
  const since = source.lastFetchedAt ?? new Date(Date.now() - 24 * 60 * 60 * 1000);
  const raw = await fetcher.fetchNew(since);

  const { count } = await prisma.article.createMany({
    data: raw.map((r) => ({
      sourceId: source.id,
      externalId: r.externalId,
      canonicalUrl: canonicalUrl(r.url),
      title: r.title,
      snippet: r.snippet?.slice(0, 500),
      publishedAt: r.publishedAt,
    })),
    skipDuplicates: true, // makes reruns safe
  });

  await prisma.source.update({ where: { id: source.id }, data: { lastFetchedAt: new Date() } });
  return { source: fetcher.name, fetched: raw.length, inserted: count };
}