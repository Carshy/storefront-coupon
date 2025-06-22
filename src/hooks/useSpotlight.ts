// src/hooks/useSpotlight.ts
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';

export interface SpotlightConfig {
  intervalDuration: number;
  flickerDuration: number;
  autoPlay: boolean;
}

export interface CategorySpotlight {
  category: string;
  products: Product[];
  currentImageIndex: number;
}

const defaultConfig: SpotlightConfig = {
  intervalDuration: 1000, // 2 seconds
  flickerDuration: 150,   // 150ms flicker
  autoPlay: true,
};

export const useSpotlight = (
  products: Product[],
  categories: string[],
  config: Partial<SpotlightConfig> = {}
) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [categorySpotlights, setCategorySpotlights] = useState<CategorySpotlight[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize spotlight data
  const initializeSpotlights = useCallback(() => {
    if (products.length > 0 && categories.length > 0) {
      const spotlights: CategorySpotlight[] = categories.map((category) => ({
        category,
        products: products.filter((product) => product.category === category),
        currentImageIndex: 0,
      }));
      setCategorySpotlights(spotlights);
    }
  }, [products, categories]);

  // Initialize when data is available
  useEffect(() => {
    initializeSpotlights();
  }, [initializeSpotlights]);

  // Cycling and flickering effect
  useEffect(() => {
    if (!finalConfig.autoPlay || categorySpotlights.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      // Update image indices
      setCategorySpotlights((prev) =>
        prev.map((spotlight) => ({
          ...spotlight,
          currentImageIndex: spotlight.products.length > 0 
            ? (spotlight.currentImageIndex + 1) % spotlight.products.length
            : 0,
        }))
      );

      // Create flicker effect
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), finalConfig.flickerDuration);
    }, finalConfig.intervalDuration);

    return () => clearInterval(interval);
  }, [finalConfig.autoPlay, finalConfig.intervalDuration, finalConfig.flickerDuration, categorySpotlights.length]);

  return {
    categorySpotlights,
    isVisible,
  };
};