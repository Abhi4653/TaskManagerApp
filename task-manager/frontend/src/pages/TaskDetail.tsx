import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  useEffect(() => { (async () => { if (id) { const res = await api.get(`/tasks/${id}`); setTask(res.data.task); } })(); }, [id]);
  if (!task) return <div>Loading...</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <div className="bg-white p-4 rounded border">
        <div>Status: {task.status}</div>
        <div>Priority: {task.priority}</div>
      </div>
    </div>
  );
}
