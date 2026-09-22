import { vi, describe, it, expect } from 'vitest';

// vi.mock('@anthropic-ai/sdk', () => {
//   return {
//     default: class Anthropic {
//       constructor() {
//         this.messages = {
//           create: vi.fn().mockRejectedValue(new Error('API failure')),
//         };
//       }
//     },
//   };
// });

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class Anthropic {
      constructor() {
        this.messages = {
          create: mockCreate,
        };
      }
    },
  };
});

import { summarizeArticle } from './ai.js';

describe('summarizeArticle', () => {
  it('returns a fallback when the Claude API fails', async () => {
    const article = {
      title: 'Test article',
      description: 'This is a test description.',
    };

    const result = await summarizeArticle(article);

    expect(result).toEqual({
      summary: 'This is a test description.',
      tags: ['Tech'],
      difficulty: 'intermediate',
      sentiment: 'neutral',
    });
  });
});

it('returns the parsed Claude response when the API succeeds', async () => {
  mockCreate.mockResolvedValue({
    content: [
      {
        text: JSON.stringify({
          summary: 'A generated summary.',
          tags: ['AI', 'Web Dev'],
          difficulty: 'beginner',
          sentiment: 'positive',
        }),
      },
    ],
  });

  const article = {
    title: 'Test article',
    description: 'This is a test description.',
  };

  const result = await summarizeArticle(article);

  expect(result).toEqual({
    summary: 'A generated summary.',
    tags: ['AI', 'Web Dev'],
    difficulty: 'beginner',
    sentiment: 'positive',
  });
});