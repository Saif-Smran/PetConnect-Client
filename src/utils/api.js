import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { getFreshFirebaseToken } from './tokenUtils';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get current user from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await getFreshFirebaseToken(user);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
