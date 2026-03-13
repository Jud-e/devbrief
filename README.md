# ⬡ DevBrief

> AI-powered tech news digest for engineers. Real-time articles with Claude-generated summaries, topic tags, and sentiment analysis.

![DevBrief](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Express-6ee7b7?style=flat-square)
![AI](https://img.shields.io/badge/AI-Claude%20API-a78bfa?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## ✨ Features

- **Live Tech News Feed** — Pulls from NewsAPI with category filtering (AI, Web Dev, Cloud, Security, Open Source, Startups)
- **AI-Powered Summaries** — Each article enriched with a 2-3 sentence developer-focused summary via Claude
- **Smart Tagging** — Automatic topic tags and sentiment scoring (positive/neutral/negative)
- **Reading Difficulty** — Articles rated beginner / intermediate / advanced
- **Article Search** — Full-text search across tech news
- **Bookmarks** — Save articles to a personal reading list (persisted in localStorage)
- **JWT Auth** — Login/register with JSON Web Tokens
- **Server-side Caching** — 10-minute in-memory cache to minimize API calls
- **Rate Limiting** — Express rate limiter to protect endpoints

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, React Router v6 |
| Backend | Node.js, Express, ES Modules |
| AI | Anthropic Claude API (`claude-sonnet-4`) |
| News | NewsAPI.org |
| Auth | JSON Web Tokens (JWT) |
| Styling | Custom CSS with CSS variables, no UI framework |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [NewsAPI key](https://newsapi.org/register) (free tier works)
- [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/devbrief.git
cd devbrief
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
# Fill in your API keys in .env
npm install
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo login:** `demo@devbrief.app` / `demo1234`

## 🌐 Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Deploy via Vercel CLI or connect your GitHub repo at vercel.com
```

Set environment variables in Vercel dashboard — none needed for the client (it uses the proxy).

Update `vite.config.ts` proxy target to your Railway backend URL before building for production:

```ts
// vite.config.ts — for production, use env var
server: {
  proxy: {
    '/api': process.env.VITE_API_URL || 'http://localhost:3001'
  }
}
```

### Backend → Railway

1. Push to GitHub
2. Create new project at [railway.app](https://railway.app)
3. Connect your repo, set root directory to `server/`
4. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NEWS_API_KEY`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel URL)

## 📁 Project Structure

```
devbrief/
├── client/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # ArticleCard, Navbar
│   │   ├── pages/           # Feed, Bookmarks, Login, Search
│   │   ├── hooks/           # useAuth, useBookmarks, useNews
│   │   ├── utils/           # API client
│   │   └── types/           # TypeScript interfaces
│   └── vite.config.ts
│
└── server/                  # Express backend
    └── src/
        ├── routes/          # auth.js, news.js
        ├── services/        # ai.js (Claude integration)
        └── middleware/      # auth.js, rateLimiter.js
```

## 🔑 Environment Variables

**Server (`server/.env`):**

```env
PORT=3001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-ant-...
NEWS_API_KEY=your-newsapi-key
```

## 🧩 Key Design Decisions

- **Server-side AI enrichment** — AI summaries are generated on the backend so API keys stay secure and results are cacheable
- **Graceful degradation** — If AI enrichment fails, articles still display with original descriptions
- **Rate-conscious** — Only the top 6 articles per page are AI-enriched to keep costs low
- **No database** — Bookmarks use localStorage for simplicity; easy to swap in PostgreSQL for a user-specific reading list

## 📄 License

MIT
