'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
            {truncateTitle(product.title)}
          </h3>
        </Link>
        
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
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label={`Add ${product.title} to cart`}
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