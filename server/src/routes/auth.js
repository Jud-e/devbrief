import express from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devbrief-secret';

// Demo users — in production, use a real DB
const DEMO_USERS = [
  { id: '1', email: 'demo@devbrief.app', password: 'demo1234', name: 'Demo User' },
];

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

authRouter.post('/register', (req, res) => {
  const { email, name } = req.body;
  // In production: hash password, store in DB
  const token = jwt.sign({ id: Date.now().toString(), email, name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email, name } });
});
