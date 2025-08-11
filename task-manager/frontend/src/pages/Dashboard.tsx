import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import TaskFormModal from '../components/TaskFormModal';
import TaskCard from '../components/TaskCard';
import { api } from '../services/api';

type Task = { id: string; title: string; status: string; priority: string; dueDate?: string | null };

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/tasks');
      setTasks(res.data.items || []);
    })();
  }, []);

  const todayTasks = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const dt = new Date(t.dueDate);
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
    });
  }, [tasks]);

  const completionData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];
  }, [tasks]);

  const statusBarData = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const t of tasks) byStatus[t.status] = (byStatus[t.status] || 0) + 1;
    return Object.entries(byStatus).map(([status, count]) => ({ status, count }));
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6 bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/80">Overview of your tasks and progress</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-white text-purple-700 font-medium hover:bg-white/90 self-start md:self-auto">Add Task</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Today's Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {todayTasks.map(t => (
              <TaskCard key={t.id} id={t.id} title={t.title} status={t.status} priority={t.priority} dueDate={t.dueDate || undefined} />
            ))}
            {todayTasks.length === 0 && <div className="text-sm text-gray-500">No tasks due today</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-3">Completion</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-lg font-semibold mb-3">Tasks per Status</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusBarData}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TaskFormModal open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
    </div>
  );
}
