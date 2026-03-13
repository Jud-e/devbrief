import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function summarizeArticle(article) {
  const prompt = `You are a tech news analyst. Given this article, provide a JSON response with:
- "summary": A concise 2-3 sentence summary for a software developer audience
- "tags": Array of 3-5 topic tags from: [AI, Web Dev, Cloud, Security, Open Source, DevOps, Mobile, Hardware, Startups, Languages]
- "difficulty": Reading complexity: "beginner", "intermediate", or "advanced"
- "sentiment": "positive", "neutral", or "negative"

Article title: ${article.title}
Article description: ${article.description || 'No description available'}

Respond ONLY with valid JSON, no markdown.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error('AI summarization error:', err.message);
    return {
      summary: article.description || 'No summary available.',
      tags: ['Tech'],
      difficulty: 'intermediate',
      sentiment: 'neutral',
    };
  }
}
