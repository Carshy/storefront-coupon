export interface Product {
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
  rating: {
    rate: number,
    count: number
  }
}

export interface ProductsState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
}

export interface EnhancedProductsState extends ProductsState {
  currentProduct: Product | null;
  currentProductLoading: boolean;
  currentProductError: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export type ProductCategory = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing";

export interface FetchProductsParams {
  limit?: number;
  sort?: 'asc' | 'desc';
  category?: string;
}

export type ProductsApiResponse = Product[];
export type CategoriesApiResponse = string[];
