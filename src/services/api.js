import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getAssetUrl = (assetPath) => {
  if (!assetPath || assetPath.startsWith('http') || assetPath.startsWith('data:'))
    return assetPath || '';
  return `${API_BASE_URL.replace('/api', '')}/${assetPath.replace(/^\//, '')}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

//roda automaticamente em toda requisição/resposta, sem precisar repetir em cada chamada da API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const inProtectedArea = currentPath.startsWith('/admin') || currentPath.startsWith('/club-admin');

      if (inProtectedArea && typeof window !== 'undefined')
        window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
