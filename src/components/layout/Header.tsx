// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchCategories, setCurrentCategory } from '../../lib/store/slices/productSlice';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { categories, currentCategory } = useAppSelector((state) => state.products);
  // const { itemCount } = useAppSelector((state) => state.cart); // Uncomment when cart slice is ready

  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category: string | null) => {
    dispatch(setCurrentCategory(category));
    
    // Navigate to products page with category
    if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    } else {
      router.push('/products');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Check if we're on products page to show active category
  const isProductsPage = pathname === '/products' || pathname.startsWith('/products');

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-black-600 hover:text-blue-700 transition-colors">
            LuxeLine
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <button className="lg:hidden p-2 text-gray-700 hover:text-blue-600">
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {/* {itemCount || 0} */}
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Navigation Row */}
        <div className="border-t border-gray-100">
          <div className="flex items-center justify-center py-3">
            <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {/* All Categories Button */}
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !currentCategory && isProductsPage
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                All Categories
              </button>

              {/* Dynamic Categories */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    currentCategory === category && isProductsPage
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {category.replace(/'/g, '')} {/* Clean up apostrophes for display */}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </form>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-600 mb-2">Categories</div>
              <button
                onClick={() => {
                  handleCategoryClick(null);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm ${
                  !currentCategory && isProductsPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    handleCategoryClick(category);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm capitalize ${
                    currentCategory === category && isProductsPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.replace(/'/g, '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}