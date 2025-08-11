import axios from 'axios';

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing = false as boolean;
let queue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

async function refreshToken(): Promise<string> {
  const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
  return res.data.accessToken as string;
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          const newToken = await refreshToken();
          accessToken = newToken;
          queue.forEach((p) => p.resolve(newToken));
        } catch (e) {
          queue.forEach((p) => p.reject(e));
          accessToken = null;
        } finally {
          queue = [];
          refreshing = false;
        }
      }
      const token = await new Promise<string>((resolve, reject) => queue.push({ resolve, reject }));
      original.headers = original.headers || {};
      original.headers['Authorization'] = `Bearer ${token}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function tryRefreshOnStart(): Promise<string | null> {
  try {
    const token = await refreshToken();
    accessToken = token;
    return token;
  } catch {
    accessToken = null;
    return null;
  }
}
