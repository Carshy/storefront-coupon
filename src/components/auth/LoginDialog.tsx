'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectAuthLoading, selectAuthError, loginUser, clearError } from '@/lib/store/slices/userSlice';
import { Product } from '@/lib/types';
import { X, Lock, User } from 'lucide-react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  product?: Product;
  title?: string;
  subtitle?: string;
}

export default function LoginDialog({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  product,
  title = "Login Required",
  subtitle = "Sign in to continue with your purchase"
}: LoginDialogProps) {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginCredentials.username || !loginCredentials.password) {
      return;
    }

    try {
      const result = await dispatch(loginUser(loginCredentials));
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful
        setLoginCredentials({ username: '', password: '' });
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setLoginCredentials({ username: '', password: '' });
    dispatch(clearError());
    onClose();
  };

  // Handle input changes
  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setLoginCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseDialog}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Preview - Only show if product is provided */}
        {product && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {truncateTitle(product.title, 40)}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {/* Error Message */}
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{authError}</span>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="username"
                value={loginCredentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your username"
                required
                disabled={authLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
                disabled={authLoading}
              />
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Username: <code className="bg-white px-1 rounded">mor_2314</code></p>
              <p>Password: <code className="bg-white px-1 rounded">83r5^_</code></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              disabled={authLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={authLoading || !loginCredentials.username || !loginCredentials.password}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Sign In & Continue
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            Sign in to access your cart and complete your purchase
          </p>
        </div>
      </div>
    </div>
  );
}