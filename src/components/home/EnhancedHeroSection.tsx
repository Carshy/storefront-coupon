'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Gift, 
  Percent, 
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
import img6 from '../../app/media/img6.webp';

// Carousel data for fashion images - Fixed image references
const carouselData = [
  {
    id: 1,
    image: img1, // Fixed: removed the object wrapper
    title: "Summer Collection",
    description: "Discover the latest trends in summer fashion",
    accent: "from-pink-400 to-rose-500"
  },
  {
    id: 2,
    image: img2, // Fixed: removed the object wrapper
    title: "Elegant Styles",
    description: "Timeless pieces for every occasion",
    accent: "from-purple-400 to-indigo-500"
  },
  {
    id: 3,
    image: img3, // Fixed: removed the object wrapper
    title: "Urban Chic",
    description: "Modern looks for the contemporary woman",
    accent: "from-blue-400 to-cyan-500"
  },
  {
    id: 4,
    image: img4, // Fixed: removed the object wrapper
    title: "Luxury Fashion",
    description: "Premium quality meets stunning design",
    accent: "from-amber-400 to-orange-500"
  },
  {
    id: 5,
    image: img5, // Fixed: removed the object wrapper
    title: "Casual Comfort",
    description: "Comfortable styles for everyday wear",
    accent: "from-teal-400 to-blue-500"
  },
  {
    id: 6,
    image: img6, // Fixed: removed the object wrapper
    title: "Evening Glamour",
    description: "Sophisticated looks for special occasions",
    accent: "from-rose-400 to-pink-500"
  }
];

// Offers data
const offers = [
  {
    id: 1,
    discount: "10%",
    condition: "Over $67",
    color: "from-green-400 to-emerald-500",
    icon: <Percent className="w-6 h-6" />
  },
  {
    id: 2,
    discount: "15%",
    condition: "Over $100",
    color: "from-blue-400 to-indigo-500",
    icon: <Gift className="w-6 h-6" />
  },
  {
    id: 3,
    discount: "25%",
    condition: "Over $150",
    color: "from-purple-400 to-pink-500",
    icon: <Sparkles className="w-6 h-6" />
  }
];

export default function EnhancedHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useAppSelector((state) => state.products);
  
  // Featured products (first 9 products for 3x3 grid)
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
        {/* Three Column Layout - Fixed height container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-3 h-[300px]"> {/* Reduced height container */}
          
          {/* Left Column - Offers (Fixed width, smaller) */}
          <div className="w-full lg:w-72 flex-shrink-0"> {/* Reduced width for better proportion */}
            <div className="space-y-3 h-full flex flex-col">
              {offers.slice(0, 6).map((offer, index) => ( // Limit to 6 offers
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${offer.color} p-3 transform hover:scale-105 transition-all duration-300 cursor-pointer group flex-1`} // flex-1 makes each offer take equal height
                >
                  {/* Glassy overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center">
                      {offer.icon}
                      <span className="ml-2 text-xs font-medium opacity-90">SAVE NOW</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">{offer.discount} OFF</div>
                      <div className="text-sm opacity-90">{offer.condition}</div>
                    </div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full inline-block w-fit">
                      Limited Time
                    </div>
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:border-white/50 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Image Carousel (Flexible, larger) */}
          <div className="flex-1 min-w-0">
            <div className="relative h-full rounded-2xl overflow-hidden group">
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
                        priority={index === 0} // Optimize first image loading
                    />
                    
                    {/* Glassy overlay with gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-30`}></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Glitter effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                        <h3 className="text-xl font-bold mb-2 flex items-center">
                            {item.title}
                            <Sparkles className="w-5 h-5 ml-2 text-yellow-300" />
                        </h3>
                        <p className="opacity-90">{item.description}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Navigation Buttons */}
                <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous slide"
                >
                <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next slide"
                >
                <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {carouselData.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
                </div>
            </div>
        </div>

          {/* Right Column - Featured Products (Fixed width, smaller, same as left) */}
          <div className="w-full lg:w-72 flex-shrink-0"> {/* Same width as left column */}
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-center">Featured Products</h3>
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-3 gap-2 auto-rows-fr"> {/* 3 items per row, 2 rows for 6 items */}
                  {featuredProducts.slice(0, 6).map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group"
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 h-full flex flex-col">
                        <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between min-h-0">
                          <h4 className="font-semibold text-xs mb-1 line-clamp-2 text-white leading-tight">
                            {product.title.length > 15 
                              ? `${product.title.substring(0, 15)}...` 
                              : product.title
                            }
                          </h4>
                          
                          <div className="mt-auto">
                            <div className="text-xs font-bold text-green-300 mb-1">
                              {formatPrice(product.price)}
                            </div>
                            <div className="flex items-center justify-center">
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                              <span className="text-xs ml-1 opacity-90">
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
    </section>
  );
}