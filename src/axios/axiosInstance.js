import axios from 'axios';

// Use proxy in development, otherwise use environment variable or default
const baseURL = import.meta.env.DEV 
  ? '' // Use relative URLs with Vite proxy in development
  : import.meta.env.VITE_BACKEND_URL?.replace(/[%\s]$/, '') || 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Add timeout to detect network issues faster
});

// Create a separate instance for authenticated requests
const axiosTokenInstance = axios.create({
  baseURL,
  timeout: 10000, // Add timeout to detect network issues faster
});

// Add token to all requests made with axiosTokenInstance
axiosTokenInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
const handleError = (error) => {
  if (error.code === 'ECONNABORTED') {
    console.error('Request timeout:', error);
    return Promise.reject({
      message: 'Request timed out. Please try again later.'
    });
  }
  
  if (!error.response) {
    console.error('Network error:', error);
    return Promise.reject({
      message: 'Network error. Please check your connection and try again.'
    });
  }
  
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  response => response,
  handleError
);

axiosTokenInstance.interceptors.response.use(
  response => response,
  handleError
);

export { axiosInstance, axiosTokenInstance };