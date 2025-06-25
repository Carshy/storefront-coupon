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
import { 
  addToCart, 
  optimisticAddToCart,
  selectCartItemQuantity,
  selectCartLoading,
  selectCartError,
  clearCartError
} from '@/lib/store/slices/cartSlice';
import { selectIsAuthenticated } from '@/lib/store/slices/userSlice';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Plus, Minus, Check, X, Loader2, User } from 'lucide-react';
import LoginDialog from '../../../components/auth/LoginDialog';

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

  // Get cart data from Redux store
  const cartItemQuantity = useAppSelector((state) => 
    product ? selectCartItemQuantity(product.id)(state) : 0
  );
  const cartLoading = useAppSelector(selectCartLoading);
  const cartError = useAppSelector(selectCartError);

  // Get authentication state
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Local state for UI interactions
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  
  // Login dialog state
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'addToCartAndGo' | 'addToCartOnly' | 'viewCart' | null>(null);
  
  // State for pending action details (to preserve quantity and product at time of action)
  const [pendingActionDetails, setPendingActionDetails] = useState<{
    product: any;
    quantity: number;
    action: 'addToCartAndGo' | 'addToCartOnly' | 'viewCart';
  } | null>(null);

  // Enhanced login success modal state
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);
  const [isExecutingCartAction, setIsExecutingCartAction] = useState(false);

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

  // Clear cart error when component mounts
  useEffect(() => {
    if (cartError) {
      dispatch(clearCartError());
    }
  }, [dispatch, cartError]);

  // Handle authentication requirement
  const requireAuthentication = (action: 'addToCartAndGo' | 'addToCartOnly' | 'viewCart') => {
    if (isAuthenticated) {
      // User is authenticated, proceed with action immediately
      executeAction(action, product, quantity);
    } else {
      // User is not authenticated, save action details and show login dialog
      setPendingAction(action);
      setPendingActionDetails({
        product: product!,
        quantity: quantity,
        action: action
      });
      setShowLoginDialog(true);
    }
  };

  // Execute action with specific product and quantity
  const executeAction = async (
    action: 'addToCartAndGo' | 'addToCartOnly' | 'viewCart', 
    actionProduct: any, 
    actionQuantity: number
  ) => {
    switch (action) {
      case 'addToCartAndGo':
        await handleAddToCart(actionProduct, actionQuantity, true);
        break;
      case 'addToCartOnly':
        await handleAddToCart(actionProduct, actionQuantity, false);
        break;
      case 'viewCart':
        router.push('/cart');
        break;
    }
  };

  // Enhanced login success handler - now shows modal instead of auto-executing
  const handleLoginSuccess = async () => {
    setShowLoginDialog(false);
    
    if (pendingActionDetails) {
      // Show the success modal instead of auto-executing
      setShowLoginSuccessModal(true);
    }
  };

  // Handle the action from the success modal
  const handleModalAction = async () => {
    if (!pendingActionDetails) return;
    
    setIsExecutingCartAction(true);
    
    try {
      // Execute the pending action with saved details
      await executeAction(
        pendingActionDetails.action, 
        pendingActionDetails.product, 
        pendingActionDetails.quantity
      );
      
      // Close the modal
      setShowLoginSuccessModal(false);
      
    } catch (error) {
      console.error('Error executing cart action:', error);
    } finally {
      setIsExecutingCartAction(false);
      setPendingAction(null);
      setPendingActionDetails(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowLoginSuccessModal(false);
    setPendingAction(null);
    setPendingActionDetails(null);
  };

  // Handle login dialog close
  const handleLoginDialogClose = () => {
    setShowLoginDialog(false);
    setPendingAction(null);
    setPendingActionDetails(null);
  };

  // Calculate total price based on quantity
  const calculateTotalPrice = () => {
    if (!product) return 0;
    return product.price * quantity;
  };

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle quantity changes with validation
  const handleQuantityChange = (change: number): void => {
    const newQuantity = quantity + change;
    
    // Ensure quantity is at least 1 and at most 100 (reasonable limit)
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  // Direct quantity input handler
  const handleQuantityInput = (value: string): void => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
      setQuantity(numValue);
    }
  };

  // Enhanced add to cart handler with optional navigation
  const handleAddToCart = async (actionProduct?: any, actionQuantity?: number, shouldNavigate: boolean = false) => {
    const productToAdd = actionProduct || product;
    const quantityToAdd = actionQuantity || quantity;
    
    if (!productToAdd || !isAuthenticated) return;
    
    try {
      // Optimistic update for better UX
      dispatch(optimisticAddToCart({ product: productToAdd, quantity: quantityToAdd }));
      
      // Dispatch the async action
      const result = await dispatch(addToCart({ 
        product: productToAdd, 
        quantity: quantityToAdd,
        // TODO: Add userId when authentication is implemented
        // userId: currentUser?.id 
      }));
      
      if (addToCart.fulfilled.match(result)) {
        // Show success feedback only if not coming from modal
        if (!showLoginSuccessModal) {
          setShowAddedToCart(true);
          setTimeout(() => setShowAddedToCart(false), 3000);
        }
        
        // Reset quantity to 1 after successful add (only if using current state)
        if (!actionQuantity) {
          setQuantity(1);
        }
        
        console.log(`Successfully added ${quantityToAdd} x ${productToAdd.title} to cart`);
        
        // Navigate to cart page if requested
        if (shouldNavigate) {
          router.push('/cart');
        }
      } else {
        // Handle error case
        console.error('Failed to add to cart:', result.payload);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
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

  // Get action text for modal
  const getActionText = () => {
    if (!pendingActionDetails) return '';
    
    switch (pendingActionDetails.action) {
      case 'addToCartAndGo':
        return 'Add to Cart & Go to Checkout';
      case 'addToCartOnly':
        return 'Add to Cart Only';
      case 'viewCart':
        return 'View Cart';
      default:
        return 'Continue';
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
      {/* Success notification - For regular cart additions */}
      {showAddedToCart && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <Check className="w-5 h-5" />
          <span>Added to cart successfully!</span>
        </div>
      )}

      {/* Cart error notification */}
      {cartError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <span>Error: {cartError}</span>
          <button 
            onClick={() => dispatch(clearCartError())}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Enhanced Login Success Modal */}
      {showLoginSuccessModal && pendingActionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Welcome Back!</h2>
                    <p className="text-green-100 text-sm">Successfully signed in</p>
                  </div>
                </div>
                <button
                  onClick={handleModalClose}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  You're now signed in! Ready to add this item to your cart?
                </p>
              </div>

              {/* Product Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={pendingActionDetails.product.image}
                      alt={pendingActionDetails.product.title}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {pendingActionDetails.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {pendingActionDetails.quantity}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatPrice(pendingActionDetails.product.price * pendingActionDetails.quantity)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleModalAction}
                  disabled={isExecutingCartAction}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isExecutingCartAction ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {getActionText()}
                    </>
                  )}
                </button>
              </div>

              {pendingActionDetails.action === 'addToCartAndGo' && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  This will add the item to your cart and redirect you to checkout
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={handleLoginDialogClose}
        onLoginSuccess={handleLoginSuccess}
        product={product}
        title="Login Required"
        subtitle={
          pendingActionDetails 
            ? `Sign in to ${
                pendingActionDetails.action === 'addToCartAndGo' 
                  ? 'add to cart and proceed to checkout'
                  : pendingActionDetails.action === 'addToCartOnly'
                  ? 'add this item to your cart'
                  : 'view your cart'
              }`
            : "Sign in to add items to your cart"
        }
      />

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

            {/* Cart status indicator */}
            {cartItemQuantity > 0 && isAuthenticated && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full mb-4">
                <ShoppingCart className="w-4 h-4" />
                {cartItemQuantity} in cart
              </div>
            )}

            {/* Authentication status indicator */}
            {!isAuthenticated && (
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm px-3 py-1 rounded-full mb-4">
                <span>Sign in required for cart actions</span>
              </div>
            )}
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
              {/* Add to cart and navigate - requires authentication */}
              <button
                onClick={() => requireAuthentication('addToCartAndGo')}
                disabled={cartLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                aria-label={`Add ${quantity} ${product.title} to cart for ${formatPrice(calculateTotalPrice())} and go to cart`}
              >
                {cartLoading && isAuthenticated ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart & Go - {formatPrice(calculateTotalPrice())}
                  </>
                )}
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

            {/* Alternative: Separate buttons for different actions */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => requireAuthentication('addToCartOnly')}
                disabled={cartLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                aria-label={`Add ${quantity} ${product.title} to cart only`}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart Only
              </button>
              
              <button
                onClick={() => requireAuthentication('viewCart')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                View Cart
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