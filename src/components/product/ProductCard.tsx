'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await router.push(`/products/${product.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-sm text-gray-600 mt-2">Loading...</span>
          </div>
        </div>
      )}

      {/* Image Section - Clickable */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={handleCardClick}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        {/* Title - Clickable */}
        <div 
          className="cursor-pointer"
          onClick={handleCardClick}
        >
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
            {truncateTitle(product.title)}
          </h3>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(product.rating.rate)
                    ? 'text-orange-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.rating.count})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            aria-label={`Add ${product.title} to cart`}
            disabled={isLoading}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}