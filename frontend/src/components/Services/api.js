// components/Services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  withCredentials: true,
});

// >>> ADD THIS INTERCEPTOR BLOCK <<<
api.interceptors.request.use((config) => {
  // Get the token from local storage
  const token = localStorage.getItem('userToken'); 

  // If a token exists, add it to the Authorization header
  if (token) {
    // Standard format required by most authMiddleware functions: Bearer <TOKEN>
    config.headers.Authorization = `Bearer ${token}`; 
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
// >>> END INTERCEPTOR BLOCK <<<

export default api;