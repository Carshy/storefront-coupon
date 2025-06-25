// src/app/products/[id]/not-found.tsx
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-gray-200">404</div>
            <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. 
          It might have been removed, or the link might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Browse All Products
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/products?category=electronics"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=jewelery"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
            >
              Jewelry
            </Link>
            <Link
              href="/products?category=men's clothing"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
            >
              Men&apos;s Clothing
            </Link>
            <Link
              href="/products?category=women's clothing"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
            >
              Women&apos;s Clothing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}