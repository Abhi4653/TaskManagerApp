import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { logout } = useAuth();
  return (
    <header className="bg-white border-b p-3 flex justify-between items-center">
      <div />
      <button onClick={logout} className="px-3 py-1 bg-gray-800 text-white rounded">Logout</button>
    </header>
  );
}
