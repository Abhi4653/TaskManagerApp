import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { createAccessToken, createRefreshToken, verifyRefreshToken, getRefreshCookieOptions } from '../utils/token';

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string' || !isValidEmail(email) || password.length < 6) {
    res.status(400).json({ ok: false, error: 'Invalid request' });
    return;
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ ok: false, error: 'Email already in use' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
    res.status(201).json({ ok: true, accessToken });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ ok: false, error: 'Invalid request' });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ ok: false, error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ ok: false, error: 'Invalid credentials' });
      return;
    }
    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({ userId: user.id });
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
    res.json({ ok: true, accessToken });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Login failed' });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  try {
    const payload = verifyRefreshToken(token) as any;
    const accessToken = createAccessToken({ userId: payload.userId });
    res.json({ ok: true, accessToken });
  } catch {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ ok: true });
}
