// src/components/home/Spotlight.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts, fetchCategories } from '../../lib/store/slices/productSlice';
import { useSpotlight } from '@/hooks/useSpotlight';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';

export default function Spotlight() {
  const dispatch = useAppDispatch();
  const { products, categories, loading } = useAppSelector((state) => state.products);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  // Initialize component data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Always fetch fresh data to ensure we have the latest
        const [categoriesResult, productsResult] = await Promise.all([
          dispatch(fetchCategories()).unwrap(),
          dispatch(fetchProducts({ limit: 50 })).unwrap() // Increase limit to ensure we have products for all categories
        ]);
        
        console.log('Data loaded:', { 
          categories: categoriesResult.length, 
          products: productsResult.length 
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [dispatch]);

  // Ensure data is fully loaded and valid
  const isDataReady = useMemo(() => {
    const hasData = categories.length > 0 && products.length > 0 && !loading;
    
    if (hasData) {
      // Check if all categories have at least one product
      const categoriesWithProducts = categories.filter(cat => 
        products.some(p => p.category === cat)
      );
      
      console.log('Categories with products:', categoriesWithProducts);
      return categoriesWithProducts.length > 0;
    }
    
    return false;
  }, [categories, products, loading]);

  // Use custom spotlight hook only when data is ready
  const {
    categorySpotlights,
    isVisible,
  } = useSpotlight(
    isDataReady ? products : [], 
    isDataReady ? categories : [], 
    {
      intervalDuration: 2000, // Slightly longer for better UX
      flickerDuration: 200,
    }
  );

  // Track image loading status
  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(imageSrc);
      return newSet;
    });
  };

  // Check if all visible images are loaded
  useEffect(() => {
    if (categorySpotlights.length > 0) {
      const currentImages = categorySpotlights.map(spotlight => 
        spotlight.products[spotlight.currentImageIndex]?.image
      ).filter(Boolean);
      
      const allImagesLoaded = currentImages.every(img => loadedImages.has(img));
      setImagesLoaded(allImagesLoaded);
    }
  }, [categorySpotlights, loadedImages]);

  const formatCategoryName = (category: string) => {
    return category
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64 sm:h-80">
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500 animate-spin" />
        <p className="text-gray-600 font-medium text-sm sm:text-base text-center px-4">
          Loading amazing products...
        </p>
      </div>
    </div>
  );

  // Show loading state while data is not ready or images are loading
  if (!isDataReady || categorySpotlights.length === 0) {
    return (
      <div className="w-full py-8 sm:py-12 lg:py-16 bg-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-8">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Spotlight</h2>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
            </div>
            
            {/* Loading state - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-64 sm:h-80 bg-gray-200 animate-pulse flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 bg-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Spotlight</h2>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
          </div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg px-4">
            Discover our featured products across all categories
          </p>
        </div>

        {/* Spotlight Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {categorySpotlights.map((spotlight, categoryIndex) => {
            const currentProduct = spotlight.products[spotlight.currentImageIndex];
            
            // Skip if no current product
            if (!currentProduct) {
              console.warn(`No current product for category: ${spotlight.category}`);
              return (
                <div key={`${spotlight.category}-${categoryIndex}`} className="bg-white rounded-xl sm:rounded-2xl shadow-lg h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              );
            }

            const isImageLoaded = loadedImages.has(currentProduct.image);

            return (
              <div
                key={`${spotlight.category}-${categoryIndex}-${spotlight.currentImageIndex}`}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105 bg-white w-full max-w-full"
              >
                {/* Image Container with Flickering Effect - Responsive Heights */}
                <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-gray-100">
                  {/* Loading spinner overlay */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-spin" />
                    </div>
                  )}
                  
                  <div
                    className={`absolute inset-0 transition-all duration-200 ${
                      isVisible ? 'scale-100' : 'scale-105'
                    } ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={categoryIndex < 2}
                      onLoad={() => handleImageLoad(currentProduct.image)}
                      onError={(e) => {
                        console.error(`Image failed to load for ${spotlight.category}:`, currentProduct.image);
                        // Optionally set a fallback image
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-product.jpg';
                      }}
                      unoptimized={false}
                    />
                  </div>
                  
                  {/* Gradient Overlay - only show when image is loaded */}
                  {isImageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  )}
                  
                  {/* Enhanced Flash Effect - only show when image is loaded */}
                  {isImageLoaded && (
                    <div
                      className={`absolute inset-0 transition-all duration-200 ${
                        !isVisible 
                          ? 'bg-gradient-to-br from-white/30 via-blue-100/20 to-purple-100/20' 
                          : 'bg-transparent'
                      }`}
                    />
                  )}
                  
                  {/* Product Title Overlay (on hover) - Responsive */}
                  {isImageLoaded && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-gray-800 text-xs sm:text-sm font-medium bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full line-clamp-1 shadow-sm">
                        {currentProduct.title}
                      </p>
                    </div>
                  )}

                  {/* Category Badge - Responsive */}
                  {isImageLoaded && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide text-gray-700 shadow-sm">
                        {formatCategoryName(spotlight.category)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar - Fully Responsive */}
                {isImageLoaded && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-black/40 backdrop-blur-sm gap-2 sm:gap-0">
                      <p className="text-white text-sm sm:text-base lg:text-lg font-bold order-2 sm:order-1">
                        New Arrivals
                      </p>
                      
                      <Link
                        href={`/products?category=${encodeURIComponent(spotlight.category)}`}
                        className="flex items-center gap-1 text-white font-semibold hover:text-yellow-400 transition-colors duration-200 group/link border border-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm order-1 sm:order-2 self-end sm:self-auto"
                      >
                        <span className="whitespace-nowrap">Shop Now</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 flex-shrink-0" />
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Shine Effect - only show when image is loaded */}
                {isImageLoaded && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}