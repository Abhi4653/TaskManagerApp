import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const res = await api.get('/tasks');
    setItems(res.data.items || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map(t => <TaskCard key={t.id} id={t.id} title={t.title} status={t.status} priority={t.priority} />)}
      </div>
    </div>
  );
}
