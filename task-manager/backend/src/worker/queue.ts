import { Queue, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const REMINDER_QUEUE = 'task-reminders';

export interface ReminderJobData {
  taskId: string;
  userEmail: string;
  title: string;
  dueDate?: string;
}

export const reminderQueue = new Queue<ReminderJobData>(REMINDER_QUEUE, { connection });
export const reminderQueueEvents = new QueueEvents(REMINDER_QUEUE, { connection });

export function scheduleReminder(data: ReminderJobData, delayMs: number, opts: JobsOptions = {}): Promise<any> {
  return reminderQueue.add('send-reminder', data, { delay: Math.max(0, delayMs), attempts: 3, removeOnComplete: true, removeOnFail: false, ...opts });
}
