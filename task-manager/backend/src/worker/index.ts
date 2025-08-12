import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { REMINDER_QUEUE, ReminderJobData } from './queue';
import { getEmailService } from '../services/emailService';
import { prisma } from '../lib/prisma';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const email = getEmailService();

new Worker<ReminderJobData>(REMINDER_QUEUE, async job => {
  const { taskId } = job.data;
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { user: true } as any });
  if (!task || !(task as any).user?.email) return;
  const to = (task as any).user.email as string;
  const subject = `Reminder: ${task.title}`;
  const html = `<p>Your task <strong>${task.title}</strong> is due at ${task.dueDate ?? 'soon'}.</p>`;
  await email.send({ to, subject, html });
}, { connection });
