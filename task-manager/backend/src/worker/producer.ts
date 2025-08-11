import { differenceInMilliseconds, subHours, isAfter } from 'date-fns';
import { scheduleReminder } from './queue';

const DEFAULT_LEAD_HOURS = Number(process.env.REMINDER_LEAD_HOURS || 2);

export async function scheduleReminderForDueDate(opts: { taskId: string; userEmail: string; title: string; dueDate?: Date | null; leadHours?: number }) {
  const leadHours = opts.leadHours ?? DEFAULT_LEAD_HOURS;
  if (!opts.dueDate) return;
  const targetTime = subHours(opts.dueDate, leadHours);
  const delay = differenceInMilliseconds(targetTime, new Date());
  await scheduleReminder({ taskId: opts.taskId, userEmail: opts.userEmail, title: opts.title, dueDate: opts.dueDate.toISOString() }, delay);
}
