import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import pLimit from "p-limit";
import type { PrismaClient, Article } from "@prisma/client";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY
const MODEL = "claude-haiku-5-5";
export const PROMPT_VERSION = 1;
const MAX_ATTEMPTS = 3;

// Move this to a shared file in step 2 so the UI uses the same list.
export const TAGS = [
  "react", "typescript", "javascript", "java", "python", "ai", "devops",
  "security", "databases", "career", "open-source", "tools", "web", "mobile",
] as const;

const Enrichment = z.object({
  summary: z.string().min(20).max(500),
  whyItMatters: z.string().min(10).max(200),
  tags: z.array(z.enum(TAGS)).min(1).max(3),
});

function buildPrompt(a: Article) {
  return `You summarise tech news for junior developers and CS students.

Title: ${a.title}
Excerpt: ${a.snippet ?? "(none)"}
Link: ${a.canonicalUrl}

Respond with ONLY a JSON object, no other text:
{"summary": "2 plain sentences", "whyItMatters": "1 sentence for a junior dev", "tags": [1 to 3 values from: ${TAGS.join(", ")}]}

Only use facts from the title and excerpt. If they are too thin to summarise, say so briefly in the summary.`;
}

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model output");
  return text.slice(start, end + 1);
}

async function enrichOne(prisma: PrismaClient, row: Article): Promise<boolean> {
  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: buildPrompt(row) }],
    });
    const block = msg.content.find((b) => b.type === "text");
    const parsed = Enrichment.parse(JSON.parse(extractJson(block && "text" in block ? block.text : "")));

    await prisma.$transaction(async (tx) => {
      await tx.article.update({
        where: { id: row.id },
        data: {
          summary: parsed.summary,
          whyItMatters: parsed.whyItMatters,
          status: "DONE",
          model: MODEL,
          promptVersion: PROMPT_VERSION,
          lastError: null,
        },
      });
      await tx.articleTag.deleteMany({ where: { articleId: row.id } });
      for (const name of parsed.tags) {
        const tag = await tx.tag.upsert({ where: { name }, create: { name }, update: {} });
        await tx.articleTag.create({ data: { articleId: row.id, tagId: tag.id } });
      }
    });
    return true;
  } catch (err) {
    const attempts = row.attempts + 1;
    await prisma.article.update({
      where: { id: row.id },
      data: {
        attempts,
        lastError: String(err).slice(0, 500),
        status: attempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING", // the next hourly run is the retry
      },
    });
    return false;
  }
}

export async function enrichPending(prisma: PrismaClient, batchSize = 15) {
  const rows = await prisma.article.findMany({
    where: { status: "PENDING", attempts: { lt: MAX_ATTEMPTS } },
    orderBy: { publishedAt: "desc" },
    take: batchSize,
  });
  const limit = pLimit(5);
  const results = await Promise.all(rows.map((r) => limit(() => enrichOne(prisma, r))));
  const done = results.filter(Boolean).length;
  return { processed: rows.length, done, failed: rows.length - done };
}