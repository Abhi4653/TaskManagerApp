import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listTasks, createTask, getTask, updateTask, deleteTask, scheduleReminderNow } from '../controllers/taskController';

const router = Router();

router.use(authMiddleware);

router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/schedule-reminder', scheduleReminderNow);

export default router;
