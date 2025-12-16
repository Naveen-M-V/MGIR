import axios from 'axios';

// Use Vite environment variables (import.meta.env instead of process.env)
const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : 'http://localhost:5000/api';

console.log('API Base URL:', BASE_URL); // For debugging

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  signup: (userData) => axios.post('/auth/signup', userData),
  login: (credentials) => axios.post('/auth/login', credentials),
  logout: () => axios.post('/auth/logout'),
  getProfile: () => axios.get('/auth/me'),
  updateProfile: (userData) => axios.put('/auth/update-profile', userData),
  changePassword: (passwords) => axios.put('/auth/change-password', passwords),
  verifyOTP: (data) => axios.post('/auth/verify-otp', data),
  resendOTP: (data) => axios.post('/auth/resend-otp', data)
};

// User APIs
export const userAPI = {
  getWishlist: () => axios.get('/users/wishlist'),
  addToWishlist: (item) => axios.post('/users/wishlist', { item }),
  removeFromWishlist: (item) => axios.delete(`/users/wishlist/${encodeURIComponent(item)}`),
  getBookings: () => axios.get('/users/bookings'),
  createBooking: (booking) => axios.post('/users/bookings', booking)
};

// Legacy APIs (keep for compatibility)
export const getEmployees = () => axios.get(`${BASE_URL}/employees`);
export const addEmployee = (employee) => axios.post(`${BASE_URL}/employees`, employee);