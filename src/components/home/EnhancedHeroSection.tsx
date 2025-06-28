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
    <section className="text-white py-2 lg:pt-6 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Responsive Layout - Stack on mobile, grid on larger screens */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 mb-4 lg:h-[19rem]">
          
          {/* Left Column - Offers (Fixed height for large devices) */}
          <div className="lg:col-span-3 w-full lg:min-h-[19rem]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-[3%] transform hover:scale-[1.02] transition-all duration-700 cursor-pointer group h-[280px] sm:h-[320px] lg:h-full flex flex-col shadow-lg hover:shadow-2xl min-h-0">
              
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-200/30"></div>
              
              {/* Premium sparkle effect */}
              <div className="absolute top-[4%] right-[4%] opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse">
                <Sparkles className="w-[clamp(1rem,4vw,1.5rem)] h-[clamp(1rem,4vw,1.5rem)] text-indigo-400" />
              </div>
              
              {/* Sophisticated decorative elements */}
              <div className="absolute top-[3%] left-[3%] w-[clamp(0.5rem,1.5vw,0.75rem)] h-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-[3%] right-[8%] w-[clamp(0.375rem,1vw,0.5rem)] h-[clamp(0.375rem,1vw,0.5rem)] bg-gradient-to-r from-rose-300 to-pink-300 rounded-full"></div>
              <div className="absolute top-1/2 left-[2%] w-[clamp(0.25rem,0.8vw,0.375rem)] h-[clamp(0.25rem,0.8vw,0.375rem)] bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full"></div>
              
              {/* Content with enhanced spacing */}
              <div className="relative z-10 flex flex-col h-full space-y-[2%] min-h-0 overflow-hidden">
                
                {/* Premium Offers Section - Fixed proportion */}
                <div className="flex items-center justify-center bg-gradient-to-r from-white via-white to-gray-50 p-[2%] rounded-2xl flex-shrink-0 shadow-md border border-gray-100/80 backdrop-blur-sm min-h-0">
                  
                  {/* First Offer */}
                  <div className="flex flex-col items-center space-y-[0.5%] flex-1 hover:scale-105 transition-transform duration-300 min-w-0">
                    <div className="relative flex items-start">
                      <span className="text-[clamp(1.2rem,5vw,2.5rem)] font-black bg-gray-700 bg-clip-text text-transparent leading-none">10</span>
                      <div className="flex flex-col justify-center items-center ml-[0.25rem]">
                        <span className="text-[clamp(0.75rem,3vw,1.2rem)] font-black bg-gray-700 bg-clip-text text-transparent leading-none">%</span>
                        <span className="text-[clamp(0.6rem,2.5vw,0.9rem)] text-gray-600 leading-none font-semibold">off</span>
                      </div>
                    </div>
                    <span className="text-[clamp(0.6rem,2vw,0.8rem)] text-gray-500 font-medium whitespace-nowrap">over $67</span>
                  </div>
                  
                  {/* Enhanced Separator */}
                  <div className="h-[clamp(1.5rem,6vw,3rem)] w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent mx-[1%] flex-shrink-0"></div>
                  
                  {/* Second Offer */}
                  <div className="flex flex-col items-center space-y-[0.5%] flex-1 hover:scale-105 transition-transform duration-300 min-w-0">
                    <div className="relative flex items-start">
                      <span className="text-[clamp(1.2rem,5vw,2.5rem)] font-black bg-green-500 bg-clip-text text-transparent leading-none">15</span>
                      <div className="flex flex-col justify-center items-center ml-[0.25rem]">
                        <span className="text-[clamp(0.75rem,3vw,1.2rem)] font-black bg-green-500 bg-clip-text text-transparent leading-none">%</span>
                        <span className="text-[clamp(0.6rem,2.5vw,0.9rem)] text-gray-600 leading-none font-semibold">off</span>
                      </div>
                    </div>
                    <span className="text-[clamp(0.6rem,2vw,0.8rem)] text-gray-500 font-medium whitespace-nowrap">over $100</span>
                  </div>
                  
                  <div className="h-[clamp(1.5rem,6vw,3rem)] w-px bg-gradient-to-b from-transparent via-emerald-200 to-transparent mx-[1%] flex-shrink-0"></div>
                  
                  {/* Third Offer */}
                  <div className="flex flex-col items-center space-y-[0.5%] flex-1 hover:scale-105 transition-transform duration-300 min-w-0">
                    <div className="relative flex items-start">
                      <span className="text-[clamp(1.2rem,5vw,2.5rem)] font-black bg-orange-500 bg-clip-text text-transparent leading-none">25</span>
                      <div className="flex flex-col justify-center items-center ml-[0.25rem]">
                        <span className="text-[clamp(0.75rem,3vw,1.2rem)] font-black bg-orange-500 bg-clip-text text-transparent leading-none">%</span>
                        <span className="text-[clamp(0.6rem,2.5vw,0.9rem)] text-gray-600 leading-none font-semibold">off</span>
                      </div>
                    </div>
                    <span className="text-[clamp(0.6rem,2vw,0.8rem)] text-gray-500 font-medium whitespace-nowrap">over $200</span>
                  </div>
                </div>
                
                {/* Enhanced Code Section - Fixed proportion */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-[1%] sm:space-y-0 sm:space-x-[2%] py-[1%] flex-shrink-0 min-h-0">
                  <span className="text-[clamp(0.75rem,2.5vw,1rem)] font-semibold text-gray-700 whitespace-nowrap">Code:</span>
                  <div className="relative group/tooltip">
                    <span className="bg-gradient-to-r from-white to-gray-50 border-2 border-indigo-200 px-[2%] py-[1%] rounded-xl cursor-pointer hover:from-indigo-50 hover:to-white hover:shadow-lg hover:border-indigo-300 transition-all duration-300 font-mono text-[clamp(0.8rem,2.5vw,1.1rem)] font-bold text-gray-800 tracking-widest transform hover:scale-105">
                      SAVE15
                    </span>
                    {/* Enhanced Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[0.5rem] px-[0.75rem] py-[0.5rem] bg-gray-900 text-white text-[clamp(0.6rem,1.8vw,0.75rem)] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-50 backdrop-blur-sm">
                      Click to copy
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <div className="text-[clamp(0.65rem,2vw,0.85rem)] text-green-500 font-semibold bg-gray-100 px-[1%] py-[0.5%] rounded-lg whitespace-nowrap">
                    max <span className="font-bold text-orange-500">40%</span>
                  </div>
                </div>
                
                {/* Premium LuxeLine Club Section - Flexible */}
                <div className="flex-1 flex flex-col justify-center space-y-[2%] min-h-0 overflow-hidden">
                  <div className="flex items-center justify-center space-x-[2%]">
                    <div className="w-[clamp(1.2rem,4vw,1.8rem)] h-[clamp(1.2rem,4vw,1.8rem)] bg-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300 flex-shrink-0">
                      <Star className="w-[60%] h-[60%] text-white" />
                    </div>
                    <span className="font-bold text-[clamp(0.9rem,3vw,1.3rem)] bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-wide whitespace-nowrap">LuxeLine Club</span>
                  </div>
                  
                  {/* Enhanced Call to Action */}
                  <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-[3%] border-2 border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm min-h-0">
                    <div className="text-center space-y-[2%]">
                      <div className="text-[clamp(0.75rem,2.5vw,1rem)] font-semibold text-gray-700">
                        Extra discount for <span className="font-black text-gray-700 text-[clamp(0.9rem,3vw,1.2rem)]">100k+</span> items!
                      </div>
                      <Link href="/contact" className="flex items-center justify-center group/cta cursor-pointer bg-gray-700 text-white px-[4%] py-[2%] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        <span className="text-[clamp(0.75rem,2.5vw,1rem)] font-bold tracking-wide whitespace-nowrap">More Details</span>
                        <ChevronRight className="w-[clamp(0.8rem,2.5vw,1.2rem)] h-[clamp(0.8rem,2.5vw,1.2rem)] ml-[0.5rem] text-white transform group-hover/cta:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Premium border with gradient */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-indigo-200/50 via-purple-200/50 to-rose-200/50 group-hover:from-indigo-300/60 group-hover:via-purple-300/60 group-hover:to-rose-300/60 transition-all duration-500" style={{padding: '1px'}}>
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
              </div>
              
              {/* Sophisticated inner glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -2px 8px rgba(255, 255, 255, 0.5)'}}></div>
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
                      <div className="bg-black/40 rounded-xl p-2 sm:p-3 border border-white/20">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 flex items-center leading-tight">
                          {item.title}
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 text-orange-500 flex-shrink-0" />
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
          <div className="lg:col-span-3 w-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50/90 to-white/90 backdrop-blur-sm p-3 sm:p-4 transform hover:scale-[1.02] transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-xl border border-white/50 h-auto flex flex-col max-h-[600px]">
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 pointer-events-none"></div>

              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-all duration-300">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>

              <div className="relative z-10 flex flex-col h-full gap-2 sm:gap-3">
                <div className="flex-shrink-0 text-center">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 tracking-wide">
                    Featured Products
                  </h3>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {featuredProducts.slice(0, 2).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group flex flex-col h-full"
                      >
                        <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 sm:p-2 border border-gray-200/60 hover:bg-white/95 hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col h-full">
                          <div className="relative w-full rounded-lg overflow-hidden mb-1 sm:mb-2 bg-gray-50/80 aspect-square">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain p-1 sm:p-1.5 group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <h4 className="font-semibold text-[9px] sm:text-[10px] md:text-xs mb-1 line-clamp-2 text-gray-800 leading-tight">
                              {product.title.length > 25 
                                ? `${product.title.substring(0, 25)}...` 
                                : product.title}
                            </h4>

                            <div className="mt-auto space-y-1">
                              <div className="text-[9px] sm:text-[10px] font-bold text-green-600 text-center">
                                {formatPrice(product.price)}
                              </div>
                              <div className="flex items-center justify-center space-x-1">
                                <Star className="w-2.5 h-2.5 text-orange-500 fill-current" />
                                <span className="text-[8px] sm:text-[9px] text-gray-600 font-medium">
                                  {product.rating.rate.toFixed(1)}
                                </span>
                                <span className="text-[7px] sm:text-[8px] text-gray-500">
                                  ({product.rating.count})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 pt-1 sm:pt-2">
                  <Link 
                    href="/products"
                    className="block bg-gradient-to-r from-gray-600 to-gray-800 text-white text-center py-1.5 sm:py-2 rounded-xl font-medium text-[10px] sm:text-xs hover:from-gray-700 hover:to-gray-900 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    View All Products
                  </Link>
                </div>
              </div>

              {/* Outer Border */}
              <div className="absolute inset-0 rounded-3xl border border-gray-200/60 group-hover:border-gray-300/80 transition-all duration-300 pointer-events-none"></div>

              {/* Subtle Inner Highlight */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)' }}></div>
            </div>
          </div>



        </div>
      </div>
    </section>
  );
}