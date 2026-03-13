import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.name, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <Link to="/" className="login-logo">⬡ DevBrief</Link>
          <p className="login-tagline">Tech news, AI-distilled</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >Sign in</button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >Create account</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={update('name')}
                required
              />
            </div>
          )}
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={update('password')}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <div className="spinner" /> : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        {mode === 'login' && (
          <div className="login-demo">
            <span>Demo account:</span>
            <code>demo@devbrief.app</code>
            <span>/</span>
            <code>demo1234</code>
          </div>
        )}
      </div>
    </div>
  );
}
