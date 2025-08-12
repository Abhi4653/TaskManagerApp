import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await login(email, password); nav('/'); } catch { setError('Login failed'); }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500">
      <div className="w-full max-w-md bg-white/90 backdrop-blur p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Welcome back</h1>
        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="w-full py-2 rounded bg-purple-600 text-white font-medium hover:bg-purple-700 transition">Sign in</button>
        </form>
      </div>
    </div>
  );
}
