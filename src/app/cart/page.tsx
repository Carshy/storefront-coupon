'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import Image from 'next/image';
import Link from 'next/link';
import {
  loadCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartLoading,
  selectCartError,
  selectCartSummary,
  clearCartError,
} from '@/lib/store/slices/cartSlice';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Loader2,
  AlertCircle,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import LogoutDialog from '../../components/auth/LogoutDialog';
import LoginDialog from '../../components/auth/LoginDialog';

export default function ShoppingCartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get cart data from Redux store
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const cartLoading = useAppSelector(selectCartLoading);
  const cartError = useAppSelector(selectCartError);
  const cartSummary = useAppSelector(selectCartSummary);

  // Local state for UI interactions
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Load cart on component mount
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle quantity update
  const handleQuantityUpdate = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await dispatch(updateCartQuantity({ 
        productId, 
        quantity: newQuantity,
        // TODO: Add userId when authentication is implemented
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (productId: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await dispatch(removeFromCart({ 
        productId,
        // TODO: Add userId when authentication is implemented
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    try {
      await dispatch(clearCart());
      setShowClearConfirmation(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Handle checkout - now opens logout dialog
  const handleCheckout = () => {
    setShowLogoutDialog(true);
  };

  // Handle logout dialog close
  const handleLogoutDialogClose = () => {
    setShowLogoutDialog(false);
  };

  // Handle login again from logout dialog
  const handleLoginAgain = () => {
    setShowLogoutDialog(false);
    setShowLoginDialog(true);
  };

  // Handle go home from logout dialog
  const handleGoHome = () => {
    setShowLogoutDialog(false);
    router.push('/');
  };

  // Handle login dialog close
  const handleLoginDialogClose = () => {
    setShowLoginDialog(false);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    // Optionally reload cart after login
    dispatch(loadCart());
  };

  // Calculate savings (placeholder - could be based on discounts)
  const calculateSavings = () => {
    // This is a placeholder - in a real app, you'd calculate based on discounts
    return 0;
  };

  // Empty cart state
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven&apos;t added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/products"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => router.back()}
              className="block w-full text-gray-600 hover:text-gray-900 py-2 transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </span>
            {cartItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirmation(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Cart sync status */}
        {cartSummary.syncStatus === 'syncing' && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Syncing cart...
          </div>
        )}
      </div>

      {/* Error state */}
      {cartError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: {cartError}</span>
            <button
              onClick={() => dispatch(clearCartError())}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {cartLoading && cartItems.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const isUpdating = updatingItems.has(item.product.id);
                
                return (
                  <div
                    key={item.product.id}
                    className={`bg-white border rounded-lg p-4 transition-opacity ${
                      isUpdating ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                            >
                              {item.product.title}
                            </Link>
                            <p className="text-sm text-gray-500 capitalize mt-1">
                              {item.product.category}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                              disabled={isUpdating || item.quantity >= 99}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.product.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cartTotal >= 50 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(5.99)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(cartTotal * 0.08)}</span>
                </div>
                
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-medium">-{formatPrice(calculateSavings())}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal + (cartTotal >= 50 ? 0 : 5.99) + (cartTotal * 0.08))}</span>
                  </div>
                </div>
              </div>

              {/* Free shipping notice */}
              {cartTotal < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-700">
                    Add {formatPrice(50 - cartTotal)} more to get free shipping!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={cartLoading || cartItems.length === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                
                <Link
                  href="/products"
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Secure checkout powered by SSL</p>
                  <div className="flex justify-center gap-2 text-xs text-gray-400">
                    <span>🔒 SSL Secure</span>
                    <span>•</span>
                    <span>💳 Safe Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Cart</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={handleLogoutDialogClose}
        onLoginAgain={handleLoginAgain}
        onGoHome={handleGoHome}
        title="Complete Checkout"
        subtitle="Finalize your order and logout securely"
      />

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={handleLoginDialogClose}
        onLoginSuccess={handleLoginSuccess}
        title="Welcome Back"
        subtitle="Sign in to continue shopping"
      />
    </div>
  );
}