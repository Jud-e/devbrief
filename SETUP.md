# DevBrief — Quick Setup

## Get running in 5 minutes

### Step 1 — Get your API keys

| Key | Where to get it | Free tier? |
|-----|----------------|------------|
| `NEWS_API_KEY` | https://newsapi.org/register | ✅ 100 req/day |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | Pay-per-use (very cheap) |

### Step 2 — Install & configure

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/devbrief.git
cd devbrief
npm run install:all

# Configure server
cd server
cp .env.example .env
# → Open .env and paste your API keys

# Configure client (optional for dev)
cd ../client
cp .env.example .env
# → Only needed if deploying to production
```

### Step 3 — Run

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend  
cd client && npm run dev
```

Open → http://localhost:5173

**Demo login:** `demo@devbrief.app` / `demo1234`

---

## Deploy to production

### Frontend (Vercel) — free

```bash
cd client
npm run build
npx vercel --prod
```

Or connect your GitHub repo at vercel.com → import project → set root to `client/`.

### Backend (Railway) — free tier available

1. Go to railway.app → New Project → Deploy from GitHub
2. Set root directory: `server`
3. Add env vars: `ANTHROPIC_API_KEY`, `NEWS_API_KEY`, `JWT_SECRET`, `CLIENT_URL`
4. Copy the generated URL → paste into Vercel as `VITE_API_URL`

---

## Troubleshooting

**"Failed to fetch news"** → Check `NEWS_API_KEY` is set in `server/.env`

**AI summaries show "No summary available"** → Check `ANTHROPIC_API_KEY` is set; the app still works without it (falls back to article descriptions)

**CORS errors** → Make sure `CLIENT_URL` in `server/.env` matches your frontend URL exactly (no trailing slash)

**Port conflict** → Change `PORT=3001` in `server/.env` and update the Vite proxy target accordingly
