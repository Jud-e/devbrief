import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { api } from '../utils/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('devbrief_token'),
  });

  useEffect(() => {
    const stored = localStorage.getItem('devbrief_user');
    const token = localStorage.getItem('devbrief_token');
    if (stored && token) {
      setAuth({ user: JSON.parse(stored), token });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('devbrief_token', data.token);
    localStorage.setItem('devbrief_user', JSON.stringify(data.user));
    setAuth({ user: data.user, token: data.token });
  };

  const register = async (email: string, name: string, _password: string) => {
    const data = await api.post<{ token: string; user: User }>('/auth/register', { email, name });
    localStorage.setItem('devbrief_token', data.token);
    localStorage.setItem('devbrief_user', JSON.stringify(data.user));
    setAuth({ user: data.user, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem('devbrief_token');
    localStorage.removeItem('devbrief_user');
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
