import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { RequestWithUser } from '../middlewares/authMiddleware';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const listQuerySchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.coerce.date().optional(),
}).merge(paginationSchema);

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.string().min(1).optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export async function listTasks(req: RequestWithUser, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }
  const { page, pageSize, status, priority, dueDate } = parsed.data as any;
  const where: any = { userId };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (dueDate) where.dueDate = { lte: dueDate };

  const [items, total] = await Promise.all([
    prisma.task.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.task.count({ where }),
  ]);
  res.json({ ok: true, items, page, pageSize, total });
}

export async function createTask(req: RequestWithUser, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }
  const { title, description, dueDate, priority, tags } = parsed.data;
  const task = await prisma.task.create({ data: { title, description, dueDate, priority, tags: tags ?? [], userId } });
  res.status(201).json({ ok: true, task });
}

export async function getTask(req: RequestWithUser, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { id } = req.params;
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) {
    res.status(404).json({ ok: false, error: 'Not found' });
    return;
  }
  res.json({ ok: true, task });
}

export async function updateTask(req: RequestWithUser, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { id } = req.params;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ ok: false, error: 'Not found' });
    return;
  }
  const task = await prisma.task.update({ where: { id }, data: parsed.data });
  res.json({ ok: true, task });
}

export async function deleteTask(req: RequestWithUser, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { id } = req.params;
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ ok: false, error: 'Not found' });
    return;
  }
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}
