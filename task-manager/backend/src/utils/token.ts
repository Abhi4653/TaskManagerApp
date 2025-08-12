import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET: Secret = process.env.JWT_SECRET || 'dev_access_secret';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXP: SignOptions['expiresIn'] = (process.env.ACCESS_TOKEN_EXP as any) || '15m';
const REFRESH_EXP: SignOptions['expiresIn'] = (process.env.REFRESH_TOKEN_EXP as any) || '7d';

export function createAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function createRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): JwtPayload | string {
  return jwt.verify(token, REFRESH_SECRET);
}

export function getRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: parseMaxAge(String(REFRESH_EXP)),
  };
}

function parseMaxAge(exp: string): number {
  // crude parser for values like '7d', '15m', '3600s'
  const m = exp.match(/^(\d+)([smhd])?$/);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(m[1], 10);
  const unit = m[2] || 's';
  const mult = unit === 's' ? 1000 : unit === 'm' ? 60 * 1000 : unit === 'h' ? 3600 * 1000 : 24 * 3600 * 1000;
  return n * mult;
}
