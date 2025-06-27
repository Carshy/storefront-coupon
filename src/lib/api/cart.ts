import axiosInstance from './axiosInstance';
import { CartItem, Product, ApiError } from '../types';

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

interface LocalCartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export const cartApi = {
  getUserCart: async (userId: number): Promise<CartApiResponse | null> => {
    try {
      const response = await axiosInstance.get<CartApiResponse[]>(`/carts/user/${userId}`);
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching cart for user ${userId}:`, error);
      throw error;
    }
  },

  createCart: async (cartData: CreateCartRequest): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.post<CartApiResponse>('/carts', cartData);
      return response.data;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  },

  updateCart: async (cartData: UpdateCartRequest): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.put<CartApiResponse>(`/carts/${cartData.id}`, cartData);
      return response.data;
    } catch (error) {
      console.error(`Error updating cart ${cartData.id}:`, error);
      throw error;
    }
  },

  deleteCart: async (cartId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/carts/${cartId}`);
    } catch (error) {
      console.error(`Error deleting cart ${cartId}:`, error);
      throw error;
    }
  },

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

const CART_STORAGE_KEY = 'shopping_cart';
const CART_EXPIRY_DAYS = 30;

class LocalCartManager {
  getLocalCart(): LocalCartItem[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      
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
      items[existingIndex].quantity += quantity;
      items[existingIndex].addedAt = new Date().toISOString();
    } else {
      items.push({
        product,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveLocalCart(items);
    return items;
  }

  removeFromLocalCart(productId: number): LocalCartItem[] {
    const items = this.getLocalCart().filter(item => item.product.id !== productId);
    this.saveLocalCart(items);
    return items;
  }

  updateLocalCartQuantity(productId: number, quantity: number): LocalCartItem[] {
    const items = this.getLocalCart();
    const itemIndex = items.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].quantity = quantity;
        items[itemIndex].addedAt = new Date().toISOString();
      }
    }

    this.saveLocalCart(items);
    return items;
  }

  clearLocalCart(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing local cart:', error);
    }
  }

  convertToCartItems(localItems: LocalCartItem[]): CartItem[] {
    return localItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));
  }

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

  async syncWithServer(userId: number): Promise<void> {
    try {
      const localItems = this.getLocalCart();
      if (localItems.length === 0) return;

      const apiProducts: CartApiItem[] = localItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const existingCart = await cartApi.getUserCart(userId);

      const cartData = {
        userId,
        date: new Date().toISOString(),
        products: apiProducts,
      };

      if (existingCart) {
        await cartApi.updateCart({
          ...cartData,
          id: existingCart.id,
        });
      } else {
        await cartApi.createCart(cartData);
      }

      console.log('Cart synced with server successfully');
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  }
}

export const localCartManager = new LocalCartManager();

export const cartOperations = {
  addProduct: async (product: Product, quantity: number, userId?: number): Promise<CartItem[]> => {
    const localItems = localCartManager.addToLocalCart(product, quantity);
    
    if (userId) {
      try {
        await localCartManager.syncWithServer(userId);
      } catch (error) {
        console.warn('Failed to sync with server, using local cart only');
      }
    }

    return localCartManager.convertToCartItems(localItems);
  },

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