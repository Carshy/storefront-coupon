// src/lib/api/cart.ts
import axiosInstance from './axiosInstance';
import { CartItem, Product, ApiError } from '../types';

// Cart API response types
interface CartApiItem {
  productId: number;
  quantity: number;
}

interface CartApiResponse {
  id: number;
  userId: number;
  date: string;
  products: CartApiItem[];
}

interface CreateCartRequest {
  userId: number;
  date: string;
  products: CartApiItem[];
}

interface UpdateCartRequest extends CreateCartRequest {
  id: number;
}

// Local storage cart item (for offline functionality)
interface LocalCartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

// Cart API functions
export const cartApi = {
  // Get user's cart (from API)
  getUserCart: async (userId: number): Promise<CartApiResponse | null> => {
    try {
      const response = await axiosInstance.get<CartApiResponse[]>(`/carts/user/${userId}`);
      // Return the most recent cart or null if no carts
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching cart for user ${userId}:`, error);
      throw error;
    }
  },

  // Create new cart
  createCart: async (cartData: CreateCartRequest): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.post<CartApiResponse>('/carts', cartData);
      return response.data;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  },

  // Update existing cart
  updateCart: async (cartData: UpdateCartRequest): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.put<CartApiResponse>(`/carts/${cartData.id}`, cartData);
      return response.data;
    } catch (error) {
      console.error(`Error updating cart ${cartData.id}:`, error);
      throw error;
    }
  },

  // Delete cart
  deleteCart: async (cartId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/carts/${cartId}`);
    } catch (error) {
      console.error(`Error deleting cart ${cartId}:`, error);
      throw error;
    }
  },

  // Get all carts (admin functionality)
  getAllCarts: async (): Promise<CartApiResponse[]> => {
    try {
      const response = await axiosInstance.get<CartApiResponse[]>('/carts');
      return response.data;
    } catch (error) {
      console.error('Error fetching all carts:', error);
      throw error;
    }
  },
};

// Local storage cart management (for better UX)
const CART_STORAGE_KEY = 'shopping_cart';
const CART_EXPIRY_DAYS = 30;

class LocalCartManager {
  // Get cart from localStorage
  getLocalCart(): LocalCartItem[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      
      // Check if cart has expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.clearLocalCart();
        return [];
      }

      return parsed.items || [];
    } catch (error) {
      console.error('Error reading local cart:', error);
      return [];
    }
  }

  // Save cart to localStorage
  saveLocalCart(items: LocalCartItem[]): void {
    try {
      if (typeof window === 'undefined') return;

      const cartData = {
        items,
        expiry: Date.now() + (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        lastUpdated: Date.now(),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }

  // Add item to local cart
  addToLocalCart(product: Product, quantity: number): LocalCartItem[] {
    const items = this.getLocalCart();
    const existingIndex = items.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      // Update existing item
      items[existingIndex].quantity += quantity;
      items[existingIndex].addedAt = new Date().toISOString();
    } else {
      // Add new item
      items.push({
        product,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveLocalCart(items);
    return items;
  }

  // Remove item from local cart
  removeFromLocalCart(productId: number): LocalCartItem[] {
    const items = this.getLocalCart().filter(item => item.product.id !== productId);
    this.saveLocalCart(items);
    return items;
  }

  // Update item quantity in local cart
  updateLocalCartQuantity(productId: number, quantity: number): LocalCartItem[] {
    const items = this.getLocalCart();
    const itemIndex = items.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].quantity = quantity;
        items[itemIndex].addedAt = new Date().toISOString();
      }
    }

    this.saveLocalCart(items);
    return items;
  }

  // Clear local cart
  clearLocalCart(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing local cart:', error);
    }
  }

  // Convert local cart items to CartItem format
  convertToCartItems(localItems: LocalCartItem[]): CartItem[] {
    return localItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));
  }

  // Get cart summary
  getCartSummary(): {
    itemCount: number;
    totalPrice: number;
    uniqueItems: number;
  } {
    const items = this.getLocalCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      itemCount,
      totalPrice,
      uniqueItems: items.length,
    };
  }

  // Sync local cart with server (for authenticated users)
  async syncWithServer(userId: number): Promise<void> {
    try {
      const localItems = this.getLocalCart();
      if (localItems.length === 0) return;

      // Convert local items to API format
      const apiProducts: CartApiItem[] = localItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Try to get existing cart
      const existingCart = await cartApi.getUserCart(userId);

      const cartData = {
        userId,
        date: new Date().toISOString(),
        products: apiProducts,
      };

      if (existingCart) {
        // Update existing cart
        await cartApi.updateCart({
          ...cartData,
          id: existingCart.id,
        });
      } else {
        // Create new cart
        await cartApi.createCart(cartData);
      }

      console.log('Cart synced with server successfully');
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Don't throw error - local cart should still work
    }
  }
}

// Export singleton instance
export const localCartManager = new LocalCartManager();

// Combined cart operations (local + server)
export const cartOperations = {
  // Add product to cart
  addProduct: async (product: Product, quantity: number, userId?: number): Promise<CartItem[]> => {
    // Always update local cart first for immediate feedback
    const localItems = localCartManager.addToLocalCart(product, quantity);
    
    // Sync with server if user is authenticated
    if (userId) {
      try {
        await localCartManager.syncWithServer(userId);
      } catch (error) {
        console.warn('Failed to sync with server, using local cart only');
      }
    }

    return localCartManager.convertToCartItems(localItems);
  },

  // Remove product from cart
  removeProduct: async (productId: number, userId?: number): Promise<CartItem[]> => {
    const localItems = localCartManager.removeFromLocalCart(productId);
    
    if (userId) {
      try {
        await localCartManager.syncWithServer(userId);
      } catch (error) {
        console.warn('Failed to sync with server, using local cart only');
      }
    }

    return localCartManager.convertToCartItems(localItems);
  },

  // Update product quantity
  updateQuantity: async (productId: number, quantity: number, userId?: number): Promise<CartItem[]> => {
    const localItems = localCartManager.updateLocalCartQuantity(productId, quantity);
    
    if (userId) {
      try {
        await localCartManager.syncWithServer(userId);
      } catch (error) {
        console.warn('Failed to sync with server, using local cart only');
      }
    }

    return localCartManager.convertToCartItems(localItems);
  },

  // Get current cart
  getCart: (): CartItem[] => {
    const localItems = localCartManager.getLocalCart();
    return localCartManager.convertToCartItems(localItems);
  },

  // Clear cart
  clearCart: async (userId?: number): Promise<void> => {
    localCartManager.clearLocalCart();
    
    if (userId) {
      try {
        const existingCart = await cartApi.getUserCart(userId);
        if (existingCart) {
          await cartApi.deleteCart(existingCart.id);
        }
      } catch (error) {
        console.warn('Failed to clear server cart');
      }
    }
  },

  // Get cart summary
  getCartSummary: () => {
    return localCartManager.getCartSummary();
  },
};