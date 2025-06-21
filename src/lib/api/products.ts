// src/lib/api/products.ts
import axiosInstance from './axiosInstance';
import { Product, FetchProductsParams, ProductsApiResponse, CategoriesApiResponse } from '../types';

// Products API functions
export const productsApi = {
  // Get all products with optional parameters
  getAll: async (params?: FetchProductsParams): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get<ProductsApiResponse>('/products', {
        params: {
          limit: params?.limit,
          sort: params?.sort,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getById: async (id: number): Promise<Product> => {
    try {
      const response = await axiosInstance.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await axiosInstance.get<CategoriesApiResponse>('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get products by category
  getByCategory: async (category: string, params?: Omit<FetchProductsParams, 'category'>): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get<ProductsApiResponse>(`/products/category/${encodeURIComponent(category)}`, {
        params: {
          limit: params?.limit,
          sort: params?.sort,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },
};

// Cache utilities for better performance
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generic cache entry type
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Type-safe cache implementation
class TypedCache {
  private productsCache = new Map<string, CacheEntry<Product[]>>();
  private categoriesCache = new Map<string, CacheEntry<string[]>>();

  setProducts(key: string, data: Product[]): void {
    this.productsCache.set(key, { data, timestamp: Date.now() });
  }

  getProducts(key: string): Product[] | null {
    const cached = this.productsCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  setCategories(key: string, data: string[]): void {
    this.categoriesCache.set(key, { data, timestamp: Date.now() });
  }

  getCategories(key: string): string[] | null {
    const cached = this.categoriesCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  clear(): void {
    this.productsCache.clear();
    this.categoriesCache.clear();
  }
}

const cache = new TypedCache();

export const cachedProductsApi = {
  getAll: async (params?: FetchProductsParams): Promise<Product[]> => {
    const cacheKey = `products_${JSON.stringify(params || {})}`;
    const cached = cache.getProducts(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const data = await productsApi.getAll(params);
    cache.setProducts(cacheKey, data);
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const cacheKey = 'categories';
    const cached = cache.getCategories(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const data = await productsApi.getCategories();
    cache.setCategories(cacheKey, data);
    return data;
  },

  // Clear cache when needed
  clearCache: () => {
    cache.clear();
  },
};