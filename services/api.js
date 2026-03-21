import axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/utils/constants';

// ── Axios Instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status === 401) {
      Cookies.remove(TOKEN_KEY);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ message, status: error.response?.status, data: error.response?.data });
  }
);

export default api;
