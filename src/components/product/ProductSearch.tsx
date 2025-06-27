'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts } from '@/lib/store/slices/productSlice';
import { Product } from '@/lib/types';

interface ProductSearchProps {
  onResultClick?: () => void;
  placeholder?: string;
  className?: string;
}

export default function ProductSearch({ 
  onResultClick, 
  placeholder = "Search products...",
  className = ""
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, loading } = useAppSelector((state) => state.products);

  // Load products when component mounts if not already loaded
  useEffect(() => {
    if (products.length === 0 && !loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setFilteredProducts([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const debounceTimer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      ).slice(0, 8); 

      setFilteredProducts(filtered);
      setIsDropdownOpen(filtered.length > 0);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
      onResultClick?.();
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setIsDropdownOpen(false);
    setSearchQuery('');
    onResultClick?.();
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
      onResultClick?.();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          onFocus={() => {
            if (filteredProducts.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
        />
        
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  </div>

                  <div className="py-2">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {truncateTitle(product.title)}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {product.category}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <span className="text-sm font-bold text-orange-600">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={handleViewAllResults}
                      className="w-full text-center py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      View all results for `&quot;`{searchQuery}`&ldquo;`
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    No products found for `&quot;`{searchQuery}`&ldquo;`
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try different keywords or browse our categories
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}