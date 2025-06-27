'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedComponent';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CartProtectedWrapperProps {
  children: React.ReactNode;
}

export default function CartProtectedWrapper({ children }: CartProtectedWrapperProps) {
  const router = useRouter();

  // Custom fallback for cart page when not authenticated
  const cartFallback = (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-orange-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In to Access Your Cart
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your shopping cart is waiting for you! Sign in to view your saved items, 
              manage quantities, and complete your purchase.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">With your account you can:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Save items for later
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Track your order history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Faster checkout process
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Sync cart across devices
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/products"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Continue Shopping
              </Link>
              
              <button
                onClick={() => router.back()}
                className="block w-full text-gray-600 hover:text-gray-900 py-2 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account? Sign up during checkout!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute
      requireAuth={true}
      showLoginDialog={true}
      fallback={cartFallback}
      loginTitle="Access Your Shopping Cart"
      loginSubtitle="Sign in to view your saved items and complete your purchase"
    >
      {children}
    </ProtectedRoute>
  );
}