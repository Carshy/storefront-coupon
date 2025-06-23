// src/components/home/Spotlight.tsx
'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts, fetchCategories } from '../../lib/store/slices/productSlice';
import { useSpotlight } from '@/hooks/useSpotlight';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function Spotlight() {
  const dispatch = useAppDispatch();
  const { products, categories, loading } = useAppSelector((state) => state.products);
  
  // Debug logging to identify the issue
  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      console.log('Debug - Categories:', categories);
      console.log('Debug - Products by category:', 
        categories.map(cat => ({
          category: cat,
          productCount: products.filter(p => p.category === cat).length,
          products: products.filter(p => p.category === cat).map(p => p.title)
        }))
      );
    }
  }, [categories, products]);

  // Ensure data is fully loaded before processing
  const isDataReady = useMemo(() => {
    return categories.length > 0 && 
           products.length > 0 && 
           !loading &&
           // Ensure all categories have products
           categories.every(cat => products.some(p => p.category === cat));
  }, [categories, products, loading]);

  // Use custom spotlight hook only when data is ready
  const {
    categorySpotlights,
    isVisible,
  } = useSpotlight(
    isDataReady ? products : [], 
    isDataReady ? categories : [], 
    {
      intervalDuration: 1800,
      flickerDuration: 200,
    }
  );

  // Initialize component data with better error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        if (categories.length === 0) {
          await dispatch(fetchCategories()).unwrap();
        }
        if (products.length === 0) {
          await dispatch(fetchProducts()).unwrap();
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [dispatch, categories.length, products.length]);

  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state while data is not ready
  if (!isDataReady || categorySpotlights.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Category Spotlight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have all expected categories
  const expectedCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  const missingCategories = expectedCategories.filter(cat => 
    !categorySpotlights.some(spotlight => spotlight.category === cat)
  );

  if (missingCategories.length > 0) {
    console.warn('Missing categories in spotlight:', missingCategories);
  }

  return (
    <div className="w-full py-9 bg-gray-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-900">Spotlight</h2>
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
        </div>

        {/* Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorySpotlights.map((spotlight, categoryIndex) => {
            const currentProduct = spotlight.products[spotlight.currentImageIndex];
            
            // Add null check and logging
            if (!currentProduct) {
              console.warn(`No current product for category: ${spotlight.category}`);
              return null;
            }

            return (
              <div
                key={`${spotlight.category}-${categoryIndex}`} // More unique key
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105 bg-white"
              >
                {/* Image Container with Flickering Effect */}
                <div className="relative h-80 w-full overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-all duration-200 ${
                      isVisible ? 'scale-100' : 'scale-105'
                    }`}
                  >
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={categoryIndex < 2}
                      // Add error handling for images
                      onError={(e) => {
                        console.error(`Image failed to load for ${spotlight.category}:`, currentProduct.image);
                      }}
                      onLoad={() => {
                        console.log(`Image loaded for ${spotlight.category}`);
                      }}
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Enhanced Flash Effect */}
                  <div
                    className={`absolute inset-0 transition-all duration-200 ${
                      !isVisible 
                        ? 'bg-gradient-to-br from-white/30 via-blue-100/20 to-purple-100/20' 
                        : 'bg-transparent'
                    }`}
                  />
                  
                  {/* Product Title Overlay (on hover) */}
                  <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-gray-800 text-sm font-medium bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full line-clamp-1 shadow-sm">
                      {currentProduct.title}
                    </p>
                  </div>

                  {/* Category Badge - Positioned at top right */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide text-gray-700 shadow-sm">
                      {formatCategoryName(spotlight.category)}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar - Full Width */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="flex justify-between items-center px-6 py-4 bg-black/40 backdrop-transparent">
                    <p className="text-white text-lg font-bold">
                      New Arrivals
                    </p>
                    
                    <Link
                      href={`/products?category=${encodeURIComponent(spotlight.category)}`}
                      className="flex items-center gap-1 text-white font-semibold hover:text-yellow-400 transition-colors duration-200 group/link border-1 border-white rounded-full pl-1 pr-1"
                    >
                      <span>Shop Now</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                      <ChevronRight className="w-4 h-4 -ml-2 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}