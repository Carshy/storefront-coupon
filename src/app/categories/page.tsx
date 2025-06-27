'use client';

import Spotlight from '../../components/home/spotlight';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Shop by Categories
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Discover our featured products across all categories
          </p>
        </div>
      </div>

      <Spotlight />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">
            Browse through our carefully curated categories to find exactly what you're looking for.
          </p>
        </div>
      </div>
    </div>
  );
}