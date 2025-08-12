import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';

export interface RequestWithUser extends Request {
  user?: { userId: string };
}

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = verifyAccessToken(token) as any;
    req.user = { userId: payload.userId };
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
}
