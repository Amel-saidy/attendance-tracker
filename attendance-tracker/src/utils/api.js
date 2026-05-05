import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add Authorization header for secured routes
API.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Force reload to trigger auth check in App.js
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const checkIn = async () => API.post('/attendance/checkin');
export const checkOut = async () => API.post('/attendance/checkout');
export const getAttendanceHistory = async () => API.get('/attendance/history');

export default API;
