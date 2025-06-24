'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import Image from 'next/image';
import { 
  fetchProductById, 
  clearCurrentProduct, 
  clearCurrentProductError 
} from '@/lib/store/slices/productSlice';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Plus, Minus } from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get product data from Redux store
  const {
    currentProduct: product,
    currentProductLoading: loading,
    currentProductError: error
  } = useAppSelector((state) => state.products);

  // Local state for UI interactions
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = params.id;
    if (!productId) {
      return;
    }

    // Clear any previous product data when component mounts
    dispatch(clearCurrentProduct());
    dispatch(clearCurrentProductError());

    // Fetch the product by ID
    const id = Array.isArray(productId) ? parseInt(productId[0]) : parseInt(productId);
    
    if (!isNaN(id)) {
      dispatch(fetchProductById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [params.id, dispatch]);

  // Calculate total price based on quantity
  const calculateTotalPrice = () => {
    if (!product) return 0;
    return product.price * quantity;
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle quantity changes with validation
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    
    // Ensure quantity is at least 1 and at most 99 (reasonable limit)
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  // Direct quantity input handler
  const handleQuantityInput = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
      setQuantity(numValue);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity,
      totalPrice: calculateTotalPrice()
    };
    
    // TODO: Implement cart functionality with Redux
    // dispatch(addToCart(cartItem));
    console.log('Adding to cart:', cartItem);
    
    // Optional: Show success notification
    alert(`Added ${quantity} x ${product.title} to cart\nTotal: ${formatPrice(calculateTotalPrice())}`);
  };

  const handleWishlist = () => {
    if (!product) return;
    console.log(`Adding product ${product.id} to wishlist`);
    // TODO: Implement wishlist functionality
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.title,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Product URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            
            {/* Details skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            {error || 'Product not found'}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => {
                dispatch(clearCurrentProductError());
                const id = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
                if (!isNaN(id)) {
                  dispatch(fetchProductById(id));
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden group">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center" role="img" aria-label={`Rating: ${product.rating.rate} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(product.rating.rate)
                        ? 'text-orange-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Category */}
            <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full capitalize mb-4">
              {product.category}
            </span>
          </div>

          {/* Pricing Section - Enhanced */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-gray-600">Unit Price:</span>
              <span className="text-xl font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {quantity > 1 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg text-gray-600">Quantity:</span>
                <span className="text-xl font-semibold text-gray-900">
                  {quantity}
                </span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Total Price:</span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatPrice(calculateTotalPrice())}
                </span>
              </div>
              
              {quantity > 1 && (
                <div className="text-sm text-gray-500 text-right mt-1">
                  {formatPrice(product.price)} × {quantity}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Enhanced Quantity Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => handleQuantityInput(e.target.value)}
                  className="w-16 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  aria-label={`Quantity: ${quantity}`}
                />
                
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= 99}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                
                <div className="ml-4 text-sm text-gray-500">
                  {quantity === 1 ? '1 item' : `${quantity} items`}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                aria-label={`Add ${quantity} ${product.title} to cart for ${formatPrice(calculateTotalPrice())}`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart - {formatPrice(calculateTotalPrice())}
              </button>
              
              <button 
                onClick={handleWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>
              
              <button 
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium">#{product.id.toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Availability:</span>
              <span className="font-medium text-green-600">In Stock</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">Free shipping on orders over $50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Return Policy:</span>
              <span className="font-medium">30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}