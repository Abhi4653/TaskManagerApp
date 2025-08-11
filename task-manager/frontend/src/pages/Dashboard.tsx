import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import TaskFormModal from '../components/TaskFormModal';

const data = [
  { name: 'Mon', tasks: 2 }, { name: 'Tue', tasks: 1 }, { name: 'Wed', tasks: 3 }, { name: 'Thu', tasks: 2 }, { name: 'Fri', tasks: 4 }
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-6 bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/80">Overview of your tasks and progress</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-white text-purple-700 font-medium hover:bg-white/90">Add Task</button>
      </div>
      <div className="bg-white p-4 rounded border">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#7c3aed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <TaskFormModal open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
    </div>
  );
}
