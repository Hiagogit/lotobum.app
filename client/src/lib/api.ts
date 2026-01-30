import axios from 'axios';
import { getAccessToken } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API_URL}/${API_VERSION}/api`,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const lotteryApi = {
  getLatest: () => api.get('/lottery/latest'),
};

export const gamesApi = {
  generate: (gameType: string) => api.post('/games/generate', { gameType }),
  save: (gameType: string, numbers: number[]) => 
    api.post('/games/save', { gameType, numbers }),
  getHistory: () => api.get('/games/history'),
};

export default api;
