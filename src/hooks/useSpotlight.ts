// src/hooks/useSpotlight.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/lib/types';

export interface SpotlightConfig {
  intervalDuration: number;
  flickerDuration: number;
  autoPlay: boolean;
  // New: category-specific intervals
  categoryIntervals?: Record<string, number>;
}

export interface CategorySpotlight {
  category: string;
  products: Product[];
  currentImageIndex: number;
  // New: track visibility state per category
  isVisible: boolean;
}

const defaultConfig: SpotlightConfig = {
  intervalDuration: 1000,
  flickerDuration: 150,
  autoPlay: true,
  // Default category intervals (in milliseconds)
  categoryIntervals: {
    'electronics': 900,
    "women's clothing": 1000,
    'jewelery': 1200,
    "men's clothing": 600,
  }
};

export const useSpotlight = (
  products: Product[],
  categories: string[],
  config: Partial<SpotlightConfig> = {}
) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [categorySpotlights, setCategorySpotlights] = useState<CategorySpotlight[]>([]);
  // Remove global isVisible since we now track per category
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize spotlight data
  const initializeSpotlights = useCallback(() => {
    if (products.length > 0 && categories.length > 0) {
      const spotlights: CategorySpotlight[] = categories.map((category) => ({
        category,
        products: products.filter((product) => product.category === category),
        currentImageIndex: 0,
        isVisible: true, // Start visible
      }));
      setCategorySpotlights(spotlights);
    }
  }, [products, categories]);

  // Initialize when data is available
  useEffect(() => {
    initializeSpotlights();
  }, [initializeSpotlights]);

  // Category-specific cycling and flickering effect
  useEffect(() => {
    if (!finalConfig.autoPlay || categorySpotlights.length === 0) {
      return;
    }

    // Clear existing timers
    Object.values(timersRef.current).forEach(timer => clearInterval(timer));
    timersRef.current = {};

    // Create individual timers for each category
    categorySpotlights.forEach((spotlight) => {
      if (spotlight.products.length === 0) return;

      // Get interval for this category, fallback to default
      const categoryInterval = finalConfig.categoryIntervals?.[spotlight.category] 
        || finalConfig.intervalDuration;

      const timer = setInterval(() => {
        // Update image index for this specific category
        setCategorySpotlights((prev) =>
          prev.map((item) => {
            if (item.category === spotlight.category) {
              return {
                ...item,
                currentImageIndex: item.products.length > 0 
                  ? (item.currentImageIndex + 1) % item.products.length 
                  : 0,
                isVisible: false, // Start flicker
              };
            }
            return item;
          })
        );

        // End flicker effect for this category after flickerDuration
        setTimeout(() => {
          setCategorySpotlights((prev) =>
            prev.map((item) => {
              if (item.category === spotlight.category) {
                return {
                  ...item,
                  isVisible: true, // End flicker
                };
              }
              return item;
            })
          );
        }, finalConfig.flickerDuration);

      }, categoryInterval);

      timersRef.current[spotlight.category] = timer;
    });

    // Cleanup function
    return () => {
      Object.values(timersRef.current).forEach(timer => clearInterval(timer));
      timersRef.current = {};
    };
  }, [
    finalConfig.autoPlay, 
    finalConfig.intervalDuration, 
    finalConfig.flickerDuration,
    finalConfig.categoryIntervals,
    categorySpotlights.length
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(timer => clearInterval(timer));
    };
  }, []);

  return {
    categorySpotlights,
    // Remove global isVisible since it's now per category
  };
};