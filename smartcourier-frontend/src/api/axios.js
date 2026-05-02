import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token || sessionStorage.getItem('token');
  const email = state.auth.email || sessionStorage.getItem('email');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (email) {
    config.headers['X-User-Email'] = email;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
