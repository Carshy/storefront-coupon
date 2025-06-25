// src/lib/api/users.ts
import axiosInstance from './axiosInstance';
import { User, ApiResponse } from '../types';

// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

// Login response interface
interface LoginResponse {
  token: string;
}

// Registration data interface
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

// Users API functions
export const usersApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<string> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      return response.data.token;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>('/users/1'); // Fake store API limitation
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Get all users (admin functionality)
  getAll: async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get<User[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: number): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Register new user (Note: Fake Store API doesn't actually create users)
  register: async (userData: RegisterData): Promise<User> => {
    try {
      const response = await axiosInstance.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Logout (client-side token removal)
  logout: async (): Promise<void> => {
    try {
      // In a real API, you might call an endpoint to invalidate the token
      // For now, we'll just handle client-side cleanup
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  // Refresh token (if your API supports it)
  refreshToken: async (): Promise<string> => {
    try {
      // This would typically use a refresh token to get a new access token
      // Fake Store API doesn't support this, so we'll simulate it
      const response = await axiosInstance.post<LoginResponse>('/auth/refresh');
      return response.data.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },
};

// Secure token management utilities
export class SecureTokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  // Set token with expiry (simulating httpOnly behavior)
  static setToken(token: string, expiresInMinutes: number = 60): void {
    if (typeof window === 'undefined') return;

    const expiryTime = Date.now() + (expiresInMinutes * 60 * 1000);
    
    try {
      // Use sessionStorage for better security (cleared when tab closes)
      sessionStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  // Get token if not expired
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const token = sessionStorage.getItem(this.TOKEN_KEY);
      const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);

      if (!token || !expiry) return null;

      // Check if token is expired
      if (Date.now() > parseInt(expiry)) {
        this.clearToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  // Store user data securely
  static setUser(user: User): void {
    if (typeof window === 'undefined') return;

    try {
      // Store in localStorage so it persists across sessions
      // In production, consider encrypting this data
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get user data
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Clear all auth data
  static clearToken(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null;
  }

  // Get token expiry time
  static getTokenExpiry(): number | null {
    if (typeof window === 'undefined') return null;

    try {
      const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      return expiry ? parseInt(expiry) : null;
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  }

  // Check if token is about to expire (within 5 minutes)
  static isTokenNearExpiry(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > (expiry - fiveMinutes);
  }
}

// Enhanced users API with secure token management
export const secureUsersApi = {
  // Login with secure token storage
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const token = await usersApi.login(credentials);
      
      // Store token securely
      SecureTokenManager.setToken(token, 60); // 1 hour expiry
      
      // Fetch user profile
      const user = await usersApi.getProfile();
      
      // Store user data
      SecureTokenManager.setUser(user);
      
      return { user, token };
    } catch (error) {
      console.error('Error in secure login:', error);
      throw error;
    }
  },

  // Logout with secure cleanup
  logout: async (): Promise<void> => {
    try {
      await usersApi.logout();
      SecureTokenManager.clearToken();
    } catch (error) {
      console.error('Error in secure logout:', error);
      throw error;
    }
  },

  // Get current user with token validation
  getCurrentUser: (): User | null => {
    if (!SecureTokenManager.isAuthenticated()) {
      return null;
    }
    return SecureTokenManager.getUser();
  },

  // Check authentication status
  isAuthenticated: (): boolean => {
    return SecureTokenManager.isAuthenticated();
  },

  // Auto-refresh token if near expiry
  checkAndRefreshToken: async (): Promise<boolean> => {
    if (!SecureTokenManager.isAuthenticated()) {
      return false;
    }

    if (SecureTokenManager.isTokenNearExpiry()) {
      try {
        const newToken = await usersApi.refreshToken();
        SecureTokenManager.setToken(newToken, 60);
        return true;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        SecureTokenManager.clearToken();
        return false;
      }
    }

    return true;
  },
};

export default secureUsersApi;