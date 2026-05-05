import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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

// Add response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
