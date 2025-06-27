'use client';

import HotProducts from '../../components/home/HotProducts';

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Shop by Hot Deals
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Discover our featured products across all special deals...
          </p>
        </div>
      </div>

      <HotProducts />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">
            Browse through our carefully curated Hot Deals to find exactly what you&apos;re looking for.
          </p>
        </div>
      </div>
    </div>
  );
}