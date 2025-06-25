// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts, fetchCategories } from '../lib/store/slices/productSlice';
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import HotProducts from '@/components/home/HotProducts';
import Spotlight from '@/components/home/spotlight';
import ProductGrid from '@/components/product/ProductGrid';
import { Truck, Shield, Headphones, RotateCcw, Star, Users, Award } from 'lucide-react';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Fetch products and categories when component mounts
    dispatch(fetchProducts({ limit: 12 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get trending products (products with high ratings)
  const trendingProducts = products
    .filter(product => product.rating.rate >= 3.5)
    .slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <div>
        <EnhancedHeroSection />
      </div>
      <div>
        <HotProducts />
      </div>
      <div>
        <Spotlight />
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">Free shipping on orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">100% secure payment processing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer support</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔥 Trending Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what's popular right now. These highly-rated products are flying off our shelves!
            </p>
          </div>
          
          <ProductGrid products={trendingProducts} loading={loading} />
          
          {!loading && trendingProducts.length > 0 && (
            <div className="text-center mt-12">
              <a
                href="/products"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                View All Products
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            
            <div>
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-lg opacity-90">Average Rating</div>
            </div>
            
            <div>
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Awards Won</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}