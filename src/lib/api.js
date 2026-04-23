import axios from 'axios';
import { useAuthStore } from './store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Auth Token Attached: ${token.substring(0, 10)}...`);
    } else {
      console.warn('[API] No Auth Token found in state!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout on unauthorized
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
