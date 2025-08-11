import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', tasks: 2 }, { name: 'Tue', tasks: 1 }, { name: 'Wed', tasks: 3 }, { name: 'Thu', tasks: 2 }, { name: 'Fri', tasks: 4 }
];

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="bg-white p-4 rounded border">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
