import axios from 'axios';

// Always use the backend URL from environment variable or default
const baseURL = import.meta.env.VITE_BACKEND_URL?.replace(/[%\s]$/, '') || 'http://localhost:9000';
console.log("Using base URL:", baseURL);

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


export { axiosInstance, axiosTokenInstance };