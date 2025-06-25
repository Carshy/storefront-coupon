// src/lib/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, Product, ApiError } from '../../types';
import { cartOperations, localCartManager } from '../../api/cart';

// Enhanced cart state with additional UI states
interface EnhancedCartState extends CartState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

// Initial state
const initialState: EnhancedCartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
  syncStatus: 'idle',
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { product, quantity, userId }: { product: Product; quantity: number; userId?: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedItems = await cartOperations.addProduct(product, quantity, userId);
      return updatedItems;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to add item to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (
    { productId, userId }: { productId: number; userId?: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedItems = await cartOperations.removeProduct(productId, userId);
      return updatedItems;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to remove item from cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { productId, quantity, userId }: { productId: number; quantity: number; userId?: number },
    { rejectWithValue }
  ) => {
    try {
      const updatedItems = await cartOperations.updateQuantity(productId, quantity, userId);
      return updatedItems;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to update item quantity');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId?: number, { rejectWithValue }) => {
    try {
      await cartOperations.clearCart(userId);
      return [];
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to clear cart');
    }
  }
);

export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const items = cartOperations.getCart();
      return items;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to load cart');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions for immediate UI updates
    clearCartError: (state) => {
      state.error = null;
    },
    
    setSyncStatus: (state, action: PayloadAction<'idle' | 'syncing' | 'synced' | 'error'>) => {
      state.syncStatus = action.payload;
    },

    // Direct cart manipulation (use with caution - prefer async thunks)
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(action.payload);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.lastUpdated = new Date().toISOString();
    },

    // Optimistic updates (for better UX before server sync)
    optimisticAddToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.lastUpdated = new Date().toISOString();
    },

    optimisticRemoveFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.lastUpdated = new Date().toISOString();
    },

    optimisticUpdateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
        
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.syncStatus = 'syncing';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(action.payload);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.syncStatus = 'error';
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.syncStatus = 'syncing';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(action.payload);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.syncStatus = 'error';
      });

    // Update quantity
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.syncStatus = 'syncing';
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(action.payload);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.syncStatus = 'error';
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.syncStatus = 'syncing';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.lastUpdated = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.syncStatus = 'error';
      });

    // Load cart
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateTotals(action.payload);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
        state.syncStatus = 'synced';
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.syncStatus = 'error';
      });
  },
});

// Export actions
export const {
  clearCartError,
  setSyncStatus,
  setCartItems,
  optimisticAddToCart,
  optimisticRemoveFromCart,
  optimisticUpdateQuantity,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: { cart: EnhancedCartState }) => state.cart;
export const selectCartItems = (state: { cart: EnhancedCartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: EnhancedCartState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: EnhancedCartState }) => state.cart.itemCount;
export const selectCartLoading = (state: { cart: EnhancedCartState }) => state.cart.loading;
export const selectCartError = (state: { cart: EnhancedCartState }) => state.cart.error;
export const selectCartSyncStatus = (state: { cart: EnhancedCartState }) => state.cart.syncStatus;

// Complex selectors
export const selectCartItemById = (productId: number) => 
  (state: { cart: EnhancedCartState }) => 
    state.cart.items.find(item => item.product.id === productId);

export const selectCartSummary = (state: { cart: EnhancedCartState }) => ({
  items: state.cart.items,
  total: state.cart.total,
  itemCount: state.cart.itemCount,
  uniqueItems: state.cart.items.length,
  loading: state.cart.loading,
  error: state.cart.error,
  lastUpdated: state.cart.lastUpdated,
  syncStatus: state.cart.syncStatus,
});

export const selectIsInCart = (productId: number) => 
  (state: { cart: EnhancedCartState }) => 
    state.cart.items.some(item => item.product.id === productId);

export const selectCartItemQuantity = (productId: number) => 
  (state: { cart: EnhancedCartState }) => 
    state.cart.items.find(item => item.product.id === productId)?.quantity || 0;

// Export reducer
export default cartSlice.reducer;