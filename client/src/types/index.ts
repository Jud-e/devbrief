export interface AIInsight {
  summary: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { id: string | null; name: string };
  author: string | null;
  ai: AIInsight;
}

export interface NewsResponse {
  articles: Article[];
  totalResults: number;
  cached?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
