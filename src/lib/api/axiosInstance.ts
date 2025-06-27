import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? 
      sessionStorage.getItem('auth_token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
      apiError.message = error.response.data?.message || error.message;
      apiError.status = error.response.status;
      
      switch (error.response.status) {
        case 401:
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_token');
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
      apiError.message = 'Network error. Please check your connection.';
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;