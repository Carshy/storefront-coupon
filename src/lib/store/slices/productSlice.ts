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

const initialState: EnhancedProductsState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  currentCategory: null,
  currentProduct: null,
  currentProductLoading: false,
  currentProductError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
    },
    
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentProductError = null;
    },
    clearCurrentProductError: (state) => {
      state.currentProductError = null;
    },
    
    clearAllErrors: (state) => {
      state.error = null;
      state.currentProductError = null;
    },
  },
  extraReducers: (builder) => {
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

export default productsSlice.reducer;
