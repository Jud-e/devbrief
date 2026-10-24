import { Router } from "express";
import { prisma } from "../db";
import { ingestSource } from "../ingest/ingest";
import { enrichPending } from "../ingest/enrich";
import { hackerNews } from "../ingest/sources/hackernews";

const fetchers = [hackerNews]; // add one entry per source
export const cronRouter = Router();

cronRouter.post("/api/cron/ingest", async (req, res) => {
  if (req.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.sendStatus(401);
  }
  const ingested = [];
  for (const f of fetchers) {
    try {
      ingested.push(await ingestSource(prisma, f));
    } catch (err) {
      ingested.push({ source: f.name, error: String(err) }); // one bad source must not stop the rest
    }
  }
  const enriched = await enrichPending(prisma);
  console.log(JSON.stringify({ job: "ingest", ingested, enriched }));
  res.json({ ingested, enriched });
});