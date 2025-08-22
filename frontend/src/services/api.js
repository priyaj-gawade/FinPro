import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getUser: () => api.get('/auth/user'),
};

// Transactions API
const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getSummary: () => api.get('/transactions/summary'),
  getCategories: () => api.get('/transactions/categories'),
  add: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// AI API
const aiAPI = {
  query: (query) => {
    const language = localStorage.getItem('language') || 'en';
    return api.post('/ai/query', { query, language });
  },
  getFinanceAdvice: (transactions, question) => {
    const language = localStorage.getItem('language') || 'en';
    return api.post('/ai/finance-advice', { transactions, question, language });
  },
};

export { authAPI, transactionsAPI, aiAPI };