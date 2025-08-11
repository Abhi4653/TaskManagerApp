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
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-2">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-3 py-1 bg-blue-600 text-white rounded w-full">Login</button>
      </form>
    </div>
  );
}
