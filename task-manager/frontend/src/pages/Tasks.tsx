import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import { useToast } from '../context/ToastContext';

export default function Tasks() {
  const { show } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get('/tasks', { params: { status: status || undefined, priority: priority || undefined, dueDate: date || undefined } });
      setItems(res.data.items || []);
    } catch {
      show('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTasks(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, priority, date]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) => t.title.toLowerCase().includes(q));
  }, [items, query]);

  async function handleCreate(data: { title: string; description?: string; dueDate?: string; priority: string }) {
    const optimistic = { id: `tmp-${Date.now()}`, title: data.title, description: data.description, dueDate: data.dueDate, priority: data.priority, status: 'pending' };
    setItems((prev) => [optimistic, ...prev]);
    setModalOpen(false);
    try {
      const res = await api.post('/tasks', data);
      const real = res.data.task;
      setItems((prev) => prev.map((t) => (t.id === optimistic.id ? real : t)));
      show('Task created', 'success');
    } catch (e) {
      setItems((prev) => prev.filter((t) => t.id !== optimistic.id));
      show('Failed to create task', 'error');
    }
  }

  async function handleEdit(id: string, data: { title?: string; description?: string; dueDate?: string; priority?: string; status?: string }) {
    const prev = items;
    const idx = prev.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const updated = { ...prev[idx], ...data };
    const next = [...prev]; next[idx] = updated; setItems(next);
    try {
      await api.put(`/tasks/${id}`, data);
      show('Task updated', 'success');
    } catch {
      setItems(prev); // rollback
      show('Failed to update task', 'error');
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((s) => s.filter((t) => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
      show('Task deleted', 'success');
    } catch {
      setItems(prev); // rollback
      show('Failed to delete task', 'error');
    }
  }

  async function handleComplete(id: string) {
    await handleEdit(id, { status: 'completed' });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Search</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded p-2">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border border-gray-300 rounded p-2">
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Due Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded p-2" />
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="px-4 py-2 rounded bg-purple-600 text-white font-medium hover:bg-purple-700">Add Task</button>
      </div>

      {loading ? (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              id={t.id}
              title={t.title}
              status={t.status}
              priority={t.priority}
              dueDate={t.dueDate}
              onEdit={(id) => { setEditing(t); setModalOpen(true); }}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
          {filtered.length === 0 && <div className="text-sm text-gray-500">No tasks</div>}
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing || undefined}
        onSubmit={async (data) => {
          if (editing) {
            await handleEdit(editing.id, data);
            setEditing(null);
            setModalOpen(false);
          } else {
            await handleCreate(data);
          }
        }}
      />
    </div>
  );
}
