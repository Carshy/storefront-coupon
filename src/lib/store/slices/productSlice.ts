// src/lib/store/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EnhancedProductsState, ApiError } from '../../types';
import { cachedProductsApi } from '../../api/products';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { limit?: number; sort?: 'asc' | 'desc' } = {}, { rejectWithValue }) => {
    try {
      const products = await cachedProductsApi.getAll(params);
      return products;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch products');
    }
  }
);

// Async thunk for fetching single product - NEW for EnhancedProductsState
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const product = await cachedProductsApi.getById(id);
      return product;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || `Failed to fetch product ${id}`);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await cachedProductsApi.getCategories();
      return categories;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch categories');
    }
  }
);

// FIXED: Use the proper API method for fetching by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const products = await cachedProductsApi.getByCategory(category);
      return products;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || `Failed to fetch products for category ${category}`);
    }
  }
);

// FIXED: Use EnhancedProductsState as the main state type
const initialState: EnhancedProductsState = {
  // Original ProductsState properties
  products: [],
  categories: [],
  loading: false,
  error: null,
  currentCategory: null,
  
  // NEW: Enhanced properties for single product
  currentProduct: null,
  currentProductLoading: false,
  currentProductError: null,
};

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Existing reducers
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
    },
    
    // NEW: Reducers for single product management
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentProductError = null;
    },
    clearCurrentProductError: (state) => {
      state.currentProductError = null;
    },
    
    // Utility reducer to clear all errors
    clearAllErrors: (state) => {
      state.error = null;
      state.currentProductError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products (for lists/collections)
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // NEW: Fetch single product (for product detail pages)
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductLoading = true;
        state.currentProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductLoading = false;
        state.currentProduct = action.payload;
        state.currentProductError = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false;
        state.currentProductError = action.payload as string;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch products by category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  setCurrentCategory, 
  clearError, 
  clearProducts,
  clearCurrentProduct,
  clearCurrentProductError,
  clearAllErrors
} = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;
