import React from 'react';
import { Link } from 'react-router-dom';

type Props = { id: string; title: string; status: string; priority: string };
export default function TaskCard({ id, title, status, priority }: Props) {
  return (
    <Link to={`/tasks/${id}`} className="block bg-white border rounded p-3 hover:shadow">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{status} • {priority}</div>
    </Link>
  );
}
