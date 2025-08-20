import axios from 'axios';

// Always use the backend URL from environment variable or default
const baseURL = import.meta.env.VITE_BACKEND_URL?.replace(/[%\s]$/, '') || 'http://localhost:9000';
console.log("Using base URL:", baseURL);

// Token expiration checker
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

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
axiosTokenInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        console.log('Token expired, clearing auth data');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        
        // Dispatch action to update Redux state
        if (window.store) {
          window.store.dispatch({ type: 'auth/handleExpiredToken' });
        }
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (token expired on server side)
axiosTokenInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Received 401 error, token may be expired');
      
      // Clear auth data
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      
      // Dispatch action to update Redux state
      if (window.store) {
        window.store.dispatch({ type: 'auth/handleExpiredToken' });
      }
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosTokenInstance };