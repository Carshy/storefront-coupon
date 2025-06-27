'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts, fetchCategories, setCurrentCategory } from '../../lib/store/slices/productSlice';
import ProductGrid from '@/components/product/ProductGrid';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Filter, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error, currentCategory } = useAppSelector(
    (state) => state.products
  );
  
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Fetch products and categories on component mount
    dispatch(fetchProducts({ sort: sortBy }));
    dispatch(fetchCategories());
  }, [dispatch, sortBy]);

  const handleCategoryChange = (category: string | null) => {
    dispatch(setCurrentCategory(category));
    if (category) {
      const filteredProducts = products.filter(product => product.category === category);
    } else {
      dispatch(fetchProducts({ sort: sortBy }));
    }
  };

  const handleSortChange = (sort: 'asc' | 'desc') => {
    setSortBy(sort);
    dispatch(fetchProducts({ sort }));
  };

  const filteredProducts = currentCategory
    ? products.filter(product => product.category === currentCategory)
    : products;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchProducts({ sort: sortBy }))}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between items-center bg-white p-3'>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mb-6 justify-center items-center bg-orange-500 p-3">
        <p className="text-white">
          Showing {filteredProducts.length} products
          {currentCategory && (
            <span className="capitalize"> in {currentCategory}</span>
          )}
        </p>
      </div>

      <ProductGrid products={filteredProducts} loading={loading} />
    </div>
  );
}