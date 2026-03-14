# ⬡ DevBrief

![DevBrief preview](./screenshot.png)

<div align="center">

![Deploy](https://img.shields.io/badge/frontend-vercel-black?style=flat-square&logo=vercel)
![Deploy](https://img.shields.io/badge/backend-render-46E3B7?style=flat-square&logo=render)
![React](https://img.shields.io/badge/react-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5-3178C6?style=flat-square&logo=typescript)
![Node](https://img.shields.io/badge/node-18+-339933?style=flat-square&logo=node.js)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**[Live Demo](https://devbrief-sigma.vercel.app)** · [Report a Bug](https://github.com/YOUR_USERNAME/devbrief/issues) · [Request a Feature](https://github.com/YOUR_USERNAME/devbrief/issues)

</div>

---

## What is DevBrief?

DevBrief is an AI-powered tech news digest built for developers. It pulls live articles from across the web, runs them through the Claude API to generate concise summaries, topic tags, and sentiment scores, and presents them in a clean editorial layout — so you can stay informed without the scroll.

## Features

- **Live news feed** — Real-time tech articles via GNews API, filterable by category (AI, Web Dev, Cloud, Security, Open Source, Startups)
- **AI enrichment** — Each article is summarized by Claude with topic tags, reading difficulty, and sentiment
- **Editorial layout** — Hero article, sidebar feed, and bottom article strip
- **Article search** — Full-text search across tech news
- **Bookmarks** — Save articles to a personal reading list
- **JWT auth** — Login and register with JSON Web Tokens
- **Cold-start handling** — Friendly loading screen while the backend wakes up

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6 |
| Backend | Node.js, Express, ES Modules |
| AI | Anthropic Claude API |
| News | GNews API |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Vercel (frontend) + Render (backend) |

## Project Structure

```
devbrief/
├── client/                  # React + TypeScript frontend
│   └── src/
│       ├── components/      # Navbar, ArticleCard
│       ├── pages/           # Feed, Bookmarks, Login, Search
│       ├── hooks/           # useAuth, useBookmarks, useNews
│       └── utils/           # API client
│
└── server/                  # Express backend
    └── src/
        ├── routes/          # auth.js, news.js
        ├── services/        # ai.js (Claude integration)
        └── middleware/      # auth.js, rateLimiter.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- [GNews API key](https://gnews.io) — free tier, no credit card
- [Anthropic API key](https://console.anthropic.com) — pay per use

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/devbrief.git
cd devbrief

# Install all dependencies
npm run install:all

# Configure environment
cd server && cp .env.example .env
# → Add your API keys to server/.env
```

### Running locally

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:** `demo@devbrief.app` / `demo1234`

## Deployment

| Service | Purpose | Free tier |
|---------|---------|-----------|
| [Vercel](https://vercel.com) | Frontend hosting | ✅ Unlimited |
| [Render](https://render.com) | Backend hosting | ✅ 750hrs/month |

See [SETUP.md](./SETUP.md) for full deployment instructions.

## Environment Variables

**`server/.env`**
```env
PORT=3001
CLIENT_URL=https://your-app.vercel.app
JWT_SECRET=your-secret
ANTHROPIC_API_KEY=sk-ant-...
NEWS_API_KEY=your-gnews-key
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](./LICENSE) for details.
