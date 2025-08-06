import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
});

// Add a request interceptor to include the JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;