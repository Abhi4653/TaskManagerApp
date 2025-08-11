import request from 'supertest';
import { app } from '../src/app';

describe('Auth endpoints smoke', () => {
  it('register should 400 on invalid body', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '1' });
    expect(res.status).toBe(400);
  });

  it('login should 400 on invalid body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 123, password: null } as any);
    expect(res.status).toBe(400);
  });

  it('refresh should 401 without cookie', async () => {
    const res = await request(app).post('/api/auth/refresh').send();
    expect(res.status).toBe(401);
  });

  it('logout should 200 and clear cookie', async () => {
    const res = await request(app).post('/api/auth/logout').send();
    expect(res.status).toBe(200);
  });
});
