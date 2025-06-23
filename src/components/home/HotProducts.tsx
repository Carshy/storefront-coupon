// src/components/home/HotProducts.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts } from '../../lib/store/slices/productSlice';

export default function HotProducts() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
        
  // Filter jewelry products
  const jewelryProducts = products.filter(product => 
    product.category === 'jewelery')
  
  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm relative">
            <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
            <span className="text-gray-300">★</span>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-sm">★</span>
        );
      }
    }
    return stars;
  };

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center py-12 px-6">
          <p className="text-red-600 text-lg font-medium">Failed to load hot products</p>
          <p className="text-gray-500 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center py-12 px-6">
          <p className="text-gray-500 text-sm mt-2">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Executive Title */}
        <div className="text-center mb-8">
  <div className="relative inline-block">
    {/* Premium Badge */}
    <div className="absolute -top-4 -right-6 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full animate-pulse z-10">
      LIMITED
    </div>
    
    {/* Decorative Lines */}
    <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 hidden lg:block">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-red-400"></div>
    </div>
    <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 hidden lg:block">
      <div className="w-16 h-px bg-gradient-to-l from-transparent via-gray-300 to-red-400"></div>
    </div>
    
    {/* Fire Icons */}
    <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
      <div className="w-6 h-6 text-red-500 opacity-70">
        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-pulse">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
    <div className="absolute -right-10 top-1/2 transform -translate-y-1/2">
      <div className="w-6 h-6 text-red-500 opacity-70">
        <svg fill="currentColor" viewBox="0 0 20 20" className="animate-pulse" style={{animationDelay: '1s'}}>
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
    
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
      Hot Deals
    </h1>
  </div>
  
  {/* Elegant Divider */}
  <div className="flex items-center justify-center space-x-3 mb-2">
    <div className="w-12 h-px bg-gray-300"></div>
    <div className="flex space-x-1">
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
      <div className="w-1.5 h-1.5 bg-red-300 rounded-full"></div>
    </div>
    <div className="w-12 h-px bg-gray-300"></div>
  </div>
  
  <p className="text-gray-600 font-medium max-w-lg mx-auto">
    Premium jewelry collection at unbeatable prices
  </p>
</div>
        
        {/* Executive Product Display */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl">
            {jewelryProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex flex-col items-center text-center group cursor-pointer"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                {/* Executive Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full p-4 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center shadow-inner">
                      <Image
                        src={product.image}
                        alt="Premium Jewelry"
                        width={150}
                        height={150}
                        className="object-contain w-full h-full p-3 transition-transform duration-700 group-hover:scale-110"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Subtle Hover Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-red-100 transition-all duration-500"></div>
                </div>
                
                {/* Executive Rating Display */}
                <div className="space-y-3">
                  {/* Star Rating */}
                  <div className="flex items-center justify-center space-x-1">
                    {renderStars(product.rating.rate)}
                  </div>
                  
                  {/* Rating Score */}
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-light text-gray-800">{product.rating.rate}</span>
                    <span className="text-gray-400 text-sm font-light">out of 5</span>
                  </div>
                  
                  {/* Review Count */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-light">
                      {product.rating.count.toLocaleString()} customer reviews
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}