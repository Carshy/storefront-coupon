import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, ApiError } from '../../types';
import { secureUsersApi, LoginCredentials, RegisterData, SecureTokenManager } from '../../api/users';

// Import RootState type
import type { RootState } from '../index';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks for authentication actions
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await secureUsersApi.login(credentials);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await secureUsersApi.logout();
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Logout failed');
    }
  }
);

export const registerUser = createAsyncThunk<
  User,
  RegisterData,
  { rejectValue: string }
>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Note: Fake Store API doesn't actually create users, 
      // but we'll simulate the process
      const user = await secureUsersApi.login({
        username: userData.username,
        password: userData.password,
      });
      return user.user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Registration failed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  'user/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is authenticated and token is valid
      const isAuth = await secureUsersApi.checkAndRefreshToken();
      if (isAuth) {
        const user = secureUsersApi.getCurrentUser();
        return user;
      }
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Auth check failed');
    }
  }
);

export const refreshToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const isRefreshed = await secureUsersApi.checkAndRefreshToken();
      if (isRefreshed) {
        const token = SecureTokenManager.getToken();
        return token || '';
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Token refresh failed');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Initialize auth state from stored data
    initializeAuth: (state) => {
      const isAuthenticated = SecureTokenManager.isAuthenticated();
      const user = SecureTokenManager.getUser();
      const token = SecureTokenManager.getToken();
      
      state.isAuthenticated = isAuthenticated;
      state.user = user;
      state.token = token;
      state.loading = false;
      state.error = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        SecureTokenManager.setUser(state.user);
      }
    },
    
    // Force logout (for security purposes)
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = 'Session expired. Please login again.';
      SecureTokenManager.clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Logout failed';
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.token = SecureTokenManager.getToken();
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Auth check failed';
      })
      
      // Refresh token cases
      .addCase(refreshToken.pending, (state) => {
        state.loading = false
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        // Token refresh failed, force logout
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        SecureTokenManager.clearToken();
      });
  },
});

// Export actions
export const {
  clearError,
  setLoading,
  initializeAuth,
  updateUserProfile,
  forceLogout,
} = userSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.user;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.user.loading;
export const selectAuthError = (state: RootState) => state.user.error;

// Utility selectors
export const selectUserFullName = (state: RootState) => {
  const user = state.user.user;
  return user ? `${user.name.firstname} ${user.name.lastname}` : '';
};

export const selectUserInitials = (state: RootState) => {
  const user = state.user.user;
  if (!user) return '';
  
  const firstInitial = user.name.firstname.charAt(0).toUpperCase();
  const lastInitial = user.name.lastname.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

export default userSlice.reducer;
