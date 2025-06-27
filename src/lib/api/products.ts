import axiosInstance from './axiosInstance';
import { Product, FetchProductsParams, ProductsApiResponse, CategoriesApiResponse } from '../types';


export const productsApi = {
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

class TypedCache {
  private productsCache = new Map<string, CacheEntry<Product[]>>();
  private categoriesCache = new Map<string, CacheEntry<string[]>>();
  private singleProductCache = new Map<number, CacheEntry<Product>>();

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

  // Categories cache methods
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

  setSingleProduct(id: number, data: Product): void {
    this.singleProductCache.set(id, { data, timestamp: Date.now() });
  }

  getSingleProduct(id: number): Product | null {
    const cached = this.singleProductCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Clear methods
  clear(): void {
    this.productsCache.clear();
    this.categoriesCache.clear();
    this.singleProductCache.clear();
  }

  clearProducts(): void {
    this.productsCache.clear();
  }

  clearSingleProducts(): void {
    this.singleProductCache.clear();
  }

  clearCategories(): void {
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

  getById: async (id: number): Promise<Product> => {
    const cached = cache.getSingleProduct(id);
    
    if (cached) {
      return cached;
    }
    
    const data = await productsApi.getById(id);
    cache.setSingleProduct(id, data);
    return data;
  },

  // Get categories with caching
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

  getByCategory: async (category: string, params?: Omit<FetchProductsParams, 'category'>): Promise<Product[]> => {
    const cacheKey = `category_${category}_${JSON.stringify(params || {})}`;
    const cached = cache.getProducts(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const data = await productsApi.getByCategory(category, params);
    cache.setProducts(cacheKey, data);
    return data;
  },

  clearCache: () => {
    cache.clear();
  },

  clearProductsCache: () => {
    cache.clearProducts();
  },

  clearSingleProductsCache: () => {
    cache.clearSingleProducts();
  },

  clearCategoriesCache: () => {
    cache.clearCategories();
  },
};

export { cache };