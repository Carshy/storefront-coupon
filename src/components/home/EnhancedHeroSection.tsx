'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import {  
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Star
} from 'lucide-react';
import img1 from '../../app/media/img1.jpg';
import img2 from '../../app/media/img2.jpg';
import img3 from '../../app/media/img3.png';
import img4 from '../../app/media/img4.jpg';
import img5 from '../../app/media/img5.webp';
import img6 from '../../app/media/img6.png';

// Carousel data for fashion images - Fixed image references
const carouselData = [
  {
    id: 1,
    image: img1,
    title: "Summer Collection",
    description: "Discover the latest trends in summer fashion",
    accent: "from-pink-400 to-rose-500"
  },
  {
    id: 2,
    image: img2,
    title: "Elegant Styles",
    description: "Timeless pieces for every occasion",
    accent: "from-purple-400 to-indigo-500"
  },
  {
    id: 3,
    image: img3,
    title: "Urban Chic",
    description: "Modern looks for the contemporary woman",
    accent: "from-blue-400 to-cyan-500"
  },
  {
    id: 4,
    image: img4,
    title: "Luxury Fashion",
    description: "Premium quality meets stunning design",
    accent: "from-amber-400 to-orange-500"
  },
  {
    id: 5,
    image: img5,
    title: "Casual Comfort",
    description: "Comfortable styles for everyday wear",
    accent: "from-teal-400 to-blue-500"
  },
  {
    id: 6,
    image: img6,
    title: "Evening Glamour",
    description: "Sophisticated looks for special occasions",
    accent: "from-rose-400 to-pink-500"
  }
];

export default function EnhancedHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useAppSelector((state) => state.products);
  
  // Featured products (first 6 products for grid)
  const featuredProducts = products.slice(0, 6);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <section className="text-white py-4 lg:py-6 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Responsive Layout - Stack on mobile, grid on larger screens */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 mb-3 lg:h-[18rem]">
          
          {/* Left Column - Offers (Fixed height for large devices) */}
          <div className="lg:col-span-3 w-full lg:min-h-[18rem]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm p-3 sm:p-4 transform hover:scale-[1.02] transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-xl border border-white/50 h-[280px] sm:h-[320px] lg:h-full flex flex-col">
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20"></div>
              
              {/* Sparkle effect */}
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-all duration-300">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              
              {/* Subtle decorative elements */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-gray-300/40 rounded-full"></div>
              <div className="absolute bottom-2 right-6 w-1 h-1 bg-gray-400/30 rounded-full"></div>
              
              {/* Content - Properly sized to fit container */}
              <div className="relative z-10 flex flex-col h-full space-y-2 sm:space-y-3">
                
                {/* First Section - Offers - Flexible sizing */}
                <div className="flex items-center justify-center bg-white p-2 sm:p-3 rounded-lg flex-shrink-0">
                  {/* First Offer */}
                  <div className="flex flex-col items-center space-y-0.5 flex-1">
                    <div className="relative flex items-start">
                      <span className="text-base sm:text-lg lg:text-xl font-black text-gray-900">10</span>
                      <div className="flex flex-col justify-center items-center ml-1">
                        <span className="text-xs sm:text-sm font-black text-gray-900 leading-none">%</span>
                        <span className="text-[9px] sm:text-xs text-gray-600 leading-none">off</span>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500">over $67</span>
                  </div>
                  
                  {/* Separator */}
                  <div className="h-4 sm:h-6 lg:h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1.5 sm:mx-2"></div>
                  
                  {/* Second Offer */}
                  <div className="flex flex-col items-center space-y-0.5 flex-1">
                    <div className="relative flex items-start">
                      <span className="text-base sm:text-lg lg:text-xl font-black text-gray-900">15</span>
                      <div className="flex flex-col justify-center items-center ml-1">
                        <span className="text-xs sm:text-sm font-black text-gray-900 leading-none">%</span>
                        <span className="text-[9px] sm:text-xs text-gray-600 leading-none">off</span>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500">over $100</span>
                  </div>
                  
                  <div className="h-4 sm:h-6 lg:h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1.5 sm:mx-2"></div>
                  
                  {/* Third Offer */}
                  <div className="flex flex-col items-center space-y-0.5 flex-1">
                    <div className="relative flex items-start">
                      <span className="text-base sm:text-lg lg:text-xl font-black text-gray-900">25</span>
                      <div className="flex flex-col justify-center items-center ml-1">
                        <span className="text-xs sm:text-sm font-black text-gray-900 leading-none">%</span>
                        <span className="text-[9px] sm:text-xs text-gray-600 leading-none">off</span>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500">over $200</span>
                  </div>
                </div>
                
                {/* Second Section - Code - Compact sizing */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-1.5 sm:py-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Code:</span>
                  <div className="relative group/tooltip">
                    <span className="bg-white/80 border border-gray-200 px-2 sm:px-3 py-1 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all font-mono text-xs sm:text-sm font-semibold text-gray-800 tracking-wider">
                      SAVE15
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                      Click to copy
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-600 font-medium">
                    max <span className="font-semibold text-gray-700">40%</span>
                  </div>
                </div>
                
                {/* Third Section - LuxeLine Club - Takes remaining space */}
                <div className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-3 min-h-0">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-sm">
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </div>
                    <span className="font-bold text-sm sm:text-base text-gray-800 tracking-wide">LuxeLine Club</span>
                  </div>
                  
                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-white/90 to-gray-50/90 rounded-xl p-2 sm:p-3 border border-gray-200/60 shadow-sm">
                    <div className="text-center space-y-1.5">
                      <div className="text-xs sm:text-sm font-medium text-gray-700">
                        Extra discount for <span className="font-bold text-gray-900">100k+</span> items!
                      </div>
                      <div className="flex items-center justify-center group/cta cursor-pointer">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-wide">Unlock Savings</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-gray-600 transform group-hover/cta:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Refined border */}
              <div className="absolute inset-0 rounded-3xl border border-gray-200/60 group-hover:border-gray-300/80 transition-all duration-300"></div>
              
              {/* Subtle inner highlight */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'}}></div>
            </div>
          </div>

          {/* Middle Column - Image Carousel (Fixed height for large devices) */}
         <div className="lg:col-span-6 w-full lg:h-full">
            <div className="relative h-64 sm:h-80 lg:h-full rounded-2xl overflow-hidden group">
              {/* Carousel Images */}
              <div className="relative h-full">
                {carouselData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    
                    {/* Glassy overlay with gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-30`}></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Glitter effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
                    
                    {/* Content - Properly positioned to avoid overlap with dots */}
                    <div className="absolute bottom-0 left-0 right-0 pb-8 sm:pb-10 lg:pb-12 px-2 sm:px-3 lg:px-4 text-white">
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-2 sm:p-3 border border-white/20">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 flex items-center leading-tight">
                          {item.title}
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 text-yellow-300 flex-shrink-0" />
                        </h3>
                        <p className="opacity-90 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons - Optimized positioning */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-1.5 sm:p-2 transition-all duration-200 opacity-70 sm:opacity-0 group-hover:opacity-100 z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-1.5 sm:p-2 transition-all duration-200 opacity-70 sm:opacity-0 group-hover:opacity-100 z-20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dots indicator - Fixed positioning to prevent overlap */}
              <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-30">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-white w-4 sm:w-6 lg:w-8' 
                        : 'bg-white/50 w-1.5 sm:w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Featured Products (Fixed height for large devices) */}
          <div className="lg:col-span-3 w-full lg:min-h-[18rem]">
  <div className="bg-gray-200 rounded-xl h-[280px] sm:h-[320px] lg:h-full">
    <div className="flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-3 sm:p-4 h-full">
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center text-black flex-shrink-0">Featured Products</h3>
      
      <div className="flex-1 min-h-0">
        {/* Responsive grid with proper sizing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 h-full auto-rows-fr">
          {featuredProducts.slice(0, 6).map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group h-full"
            >
              <div className="bg-gray-100/90 backdrop-blur-md rounded-lg p-1 sm:p-1.5 border border-white/30 hover:bg-gray-50/95 hover:shadow-md transition-all duration-300 hover:scale-105 h-full flex flex-col">
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-1 flex-shrink-0 bg-white/80">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-0.5 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-h-0 px-0.5">
                  <h4 className="font-semibold text-[8px] sm:text-[9px] mb-0.5 sm:mb-1 line-clamp-2 text-gray-800 leading-tight">
                    {product.title.length > 15 
                      ? `${product.title.substring(0, 15)}...` 
                      : product.title
                    }
                  </h4>
                  
                  <div className="mt-auto space-y-0.5">
                    <div className="text-[8px] sm:text-[9px] font-bold text-green-600 text-center">
                      {formatPrice(product.price)}
                    </div>
                    <div className="flex items-center justify-center">
                      <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-yellow-500 fill-current" />
                      <span className="text-[7px] sm:text-[8px] ml-0.5 text-gray-600">
                        {product.rating.rate.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}