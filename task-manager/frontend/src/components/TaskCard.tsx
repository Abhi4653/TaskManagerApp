import React from 'react';
import { Link } from 'react-router-dom';

type TaskCardProps = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
};

function priorityClasses(priority: string): string {
  const base = 'px-2 py-0.5 rounded text-xs font-medium';
  switch (priority) {
    case 'high':
      return `${base} bg-red-100 text-red-700`;
    case 'low':
      return `${base} bg-emerald-100 text-emerald-700`;
    default:
      return `${base} bg-amber-100 text-amber-700`;
  }
}

export default function TaskCard({ id, title, status, priority, dueDate, onEdit, onDelete, onComplete }: TaskCardProps) {
  const due = dueDate ? new Date(dueDate) : null;
  const dateLabel = due ? due.toLocaleString() : 'No due date';

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow transition flex flex-col gap-3" role="article" aria-labelledby={`task-${id}-title`}>
      <div className="flex items-start justify-between gap-2">
        <Link to={`/tasks/${id}`} className="flex-1">
          <h3 id={`task-${id}-title`} className="font-semibold line-clamp-1">{title}</h3>
          <div className="text-sm text-gray-500">
            <span>{dateLabel}</span>
          </div>
        </Link>
        <span className={priorityClasses(priority)} aria-label={`Priority ${priority}`}>{priority}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-gray-500">{status}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mark complete"
            onClick={() => onComplete?.(id)}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Complete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-7 9a.75.75 0 01-1.138.06l-3-3a.75.75 0 011.06-1.06l2.39 2.39 6.48-8.325a.75.75 0 011.065-.117z" clipRule="evenodd" /></svg>
          </button>
          <button
            type="button"
            aria-label="Edit task"
            onClick={() => onEdit?.(id)}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-600"><path d="M5.433 13.917l2.65-.662a2 2 0 00.97-.542l6.14-6.14a1.5 1.5 0 10-2.121-2.122l-6.14 6.14a2 2 0 00-.542.97l-.662 2.65a.5.5 0 00.295.588.5.5 0 00.41.018z" /><path d="M4 16.5A1.5 1.5 0 005.5 18h9A1.5 1.5 0 0016 16.5V11a.5.5 0 10-1 0v5.5a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5V6a.5.5 0 00-1 0v10.5z" /></svg>
          </button>
          <button
            type="button"
            aria-label="Delete task"
            onClick={() => onDelete?.(id)}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-rose-600"><path fillRule="evenodd" d="M8.5 3a1.5 1.5 0 00-1.415 1H5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-2.085A1.5 1.5 0 0011.5 3h-3zM6.25 7a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 016.25 7zm3.5 0a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75zm4.25.75A.75.75 0 0013.25 7v7.5a.75.75 0 001.5 0V7.75z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
