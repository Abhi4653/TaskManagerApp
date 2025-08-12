import React, { useState } from 'react';

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

type TaskFormValues = { title: string; description?: string; dueDate?: string; priority: string };
export default function TaskFormModal({ open, onClose, onSubmit, initial }: { open: boolean; onClose: () => void; onSubmit: (data: TaskFormValues) => void; initial?: Partial<TaskFormValues> }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [priority, setPriority] = useState(initial?.priority || 'normal');
  const [description, setDescription] = useState(initial?.description || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate || '');

  return (
    <Modal open={open} title={initial?.title ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title, description: description || undefined, dueDate: dueDate || undefined, priority });
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due Date</label>
            <input type="datetime-local" className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button className="px-3 py-2 rounded bg-purple-600 text-white">Save</button>
        </div>
      </form>
    </Modal>
  );
}
