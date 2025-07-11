import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

// Set token if it exists
const token = tokenManager.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.token) {
        tokenManager.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.token) {
        tokenManager.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
