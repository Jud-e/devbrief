import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { newsRouter } from './routes/news.js';
import { authRouter } from './routes/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRouter);
app.use('/api/news', newsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 DevBrief server running on port ${PORT}`);
});
