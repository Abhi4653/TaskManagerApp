import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAccessToken } from '../services/api';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
    setIsAuthenticated(!!token);
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setIsAuthenticated(true);
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.post('/auth/register', { name, email, password });
    setAccessToken(res.data.accessToken);
    setIsAuthenticated(true);
  }

  async function logout() {
    await api.post('/auth/logout');
    setAccessToken(null);
    setIsAuthenticated(false);
  }

  const value: AuthContextType = { isAuthenticated, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
