# ⬡ DevBrief

![DevBrief preview](./screenshot.png)




[Live Demo](https://devbrief-sigma.vercel.app/) · [Report a Bug](https://github.com/Jud-e/devbrief/issues) · [Request a Feature](https://github.com/Jud-e/devbrief/issues)

---

## What is DevBrief?

DevBrief is a full-stack web application that aggregates technology news and uses the **Claude API** to enrich articles with concise summaries, topic tags, reading difficulty, and sentiment.

The application combines a **React + TypeScript frontend** with a **Node.js + Express backend**, external news and AI APIs, authentication, caching, and deployment across Vercel and Render.

The goal was to make keeping up with technology news faster and easier without having to manually browse multiple sources.

## Features

* 📰 **Live technology news** — Articles fetched from the GNews API and organized by category
* 🤖 **AI enrichment** — Claude generates summaries, topic tags, reading difficulty, and sentiment
* ⚡ **Concurrent processing** — Multiple articles are enriched concurrently using `Promise.all`
* 💾 **TTL caching** — In-memory caching reduces repeated external API requests with a 10-minute expiration
* 🔐 **JWT authentication** — Login and registration flows using JSON Web Tokens
* 🛡️ **API rate limiting** — Express rate limiting helps control excessive requests
* 🔎 **Article search** — Search across technology news
* 🔖 **Bookmarks** — Save articles to a personal reading list
* 🖥️ **Cold-start handling** — Frontend feedback while the deployed backend wakes up
* 📱 **Responsive editorial UI** — Article-focused layout for browsing technology news

## Technical Highlights

### AI API orchestration

The backend sends selected articles to the Claude API for enrichment and processes multiple requests concurrently.

The application expects structured JSON from the model and falls back to existing article information when AI processing fails, allowing the news feed to remain usable even when enrichment is unavailable.

### Caching

DevBrief uses an in-memory `Map` with a **10-minute TTL** to cache category feed results.

This reduces unnecessary calls to external news and AI services when users request the same feed repeatedly.

### Backend architecture

The Express backend separates responsibilities across:

* Routes
* Authentication middleware
* Rate-limiting middleware
* AI services
* News services

The frontend communicates with the backend through a typed API utility.

## Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Frontend       | React 18, TypeScript, Vite, React Router |
| Backend        | Node.js, Express, ES Modules             |
| AI             | Anthropic Claude API                     |
| News           | GNews API                                |
| Authentication | JSON Web Tokens                          |
| Deployment     | Vercel + Render                          |
| Development    | Git, npm                                 |

## Project Structure

```text
devbrief/
├── client/
│   └── src/
│       ├── components/      # Navbar, ArticleCard
│       ├── pages/            # Feed, Bookmarks, Login, Search
│       ├── hooks/            # useAuth, useBookmarks, useNews
│       └── utils/            # API client
│
└── server/
    └── src/
        ├── routes/           # auth.js, news.js
        ├── services/         # ai.js
        └── middleware/       # auth.js, rateLimiter.js
```

## Getting Started

### Prerequisites

* Node.js 18+
* [GNews API key](https://gnews.io/)
* [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/Jud-e/devbrief.git
cd devbrief

npm run install:all
```

Configure the backend environment:

```bash
cd server
cp .env.example .env
```

Add the required API keys to `server/.env`.

### Running locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Deployment

| Service | Purpose          |
| ------- | ---------------- |
| Vercel  | Frontend hosting |
| Render  | Backend hosting  |

The application is deployed as separate frontend and backend services.

See [`SETUP.md`](./SETUP.md) for deployment configuration.

## Known Limitations & Future Improvements

DevBrief is a portfolio project and has several areas that could be improved:

* Replace prototype authentication with database-backed user accounts and secure password handling
* Add automated unit and integration tests
* Implement proper server-side pagination
* Improve cache-key handling for different pagination parameters
* Replace the in-memory cache with shared caching if the backend is horizontally scaled
* Move beyond the current prototype authentication model with stronger authorization around protected API resources

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

## License

MIT — see [`LICENSE`](./LICENSE).

---

**Built with React, TypeScript, Express, and Claude API.**

MIT — see [LICENSE](./LICENSE) for details.
