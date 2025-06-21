// src/lib/api/axiosInstance.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from secure storage (implement TokenManager later)
    const token = typeof window !== 'undefined' ? 
      sessionStorage.getItem('auth_token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: 'Something went wrong',
      status: 500,
    };

    if (error.response) {
      // Server responded with error status
      apiError.message = error.response.data?.message || error.message;
      apiError.status = error.response.status;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth data
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_token');
            // Redirect to login or dispatch logout action
          }
          apiError.message = 'Authentication required';
          break;
        case 403:
          apiError.message = 'Access forbidden';
          break;
        case 404:
          apiError.message = 'Resource not found';
          break;
        case 429:
          apiError.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          apiError.message = 'Server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error. Please check your connection.';
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;