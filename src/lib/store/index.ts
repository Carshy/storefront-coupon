// src/lib/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../store/slices/productSlice';
import cartReducer from '../store/slices/cartSlice';
import userReducer from '../store/slices/userSlice'
// Import cart reducer when we create it
// import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer
    // cart: cartReducer, // Will add this next
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;