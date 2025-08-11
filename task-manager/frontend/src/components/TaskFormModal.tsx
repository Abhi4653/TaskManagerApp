import React, { useState } from 'react';

type Props = { onSubmit: (data: { title: string; description?: string; dueDate?: string; priority: string }) => void };
export default function TaskFormModal({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('normal');
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ title, priority }); }} className="space-y-2">
      <input className="border p-2 w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <select className="border p-2 w-full" value={priority} onChange={e=>setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
    </form>
  );
}
