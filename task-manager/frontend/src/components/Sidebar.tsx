import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r p-4 hidden md:block">
      <h2 className="font-bold mb-4">Task Manager</h2>
      <nav className="space-y-2">
        <Link to="/" className="block hover:underline">Dashboard</Link>
        <Link to="/tasks" className="block hover:underline">Tasks</Link>
      </nav>
    </aside>
  );
}
