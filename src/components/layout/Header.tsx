'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchCategories, setCurrentCategory } from '../../lib/store/slices/productSlice';
import { selectUser, selectIsAuthenticated } from '@/lib/store/slices/userSlice';
import { selectCartItemCount } from '@/lib/store/slices/cartSlice';
import LoginDialog from '../auth/LoginDialog';
import LogoutDialog from '../auth/LogoutDialog';
import ProductSearch from '../../components/product/ProductSearch';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartHoverOpen, setIsCartHoverOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { categories, currentCategory } = useAppSelector((state) => state.products);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cartItemCount = useAppSelector(selectCartItemCount);

  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }

      if (
        cartDropdownRef.current && 
        !cartDropdownRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setIsCartHoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: string | null) => {
    dispatch(setCurrentCategory(category));
    
    if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    } else {
      router.push('/products');
    }
  };

  const handleUserHover = () => {
    setIsUserDropdownOpen(true);
  };

  const handleUserLeave = () => {
    setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 150);
  };

  const handleSignInClick = () => {
    setIsUserDropdownOpen(false);
    setShowLoginDialog(true);
  };

  const handleSignOutClick = () => {
    setIsUserDropdownOpen(false);
    setShowLogoutDialog(true);
  };

  const handleMyProfileClick = () => {
    setIsUserDropdownOpen(false);
    router.push('/profile');
  };

  const handleCartHover = () => {
    setIsCartHoverOpen(true);
  };

  const handleCartLeave = () => {
    setTimeout(() => {
      setIsCartHoverOpen(false);
    }, 150);
  };

  const handleCartSignInClick = () => {
    setIsCartHoverOpen(false);
    setShowLoginDialog(true);
  };

  const handleViewCartClick = () => {
    setIsCartHoverOpen(false);
    router.push('/cart');
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
  };

  const handleLogoutLoginAgain = () => {
    setShowLogoutDialog(false);
    setShowLoginDialog(true);
  };

  const handleLogoutGoHome = () => {
    setShowLogoutDialog(false);
    router.push('/');
  };

  const handleSearchResultClick = () => {
    setShowMobileSearch(false);
    setIsMenuOpen(false);
  };

  const isProductsPage = pathname === '/products' || pathname.startsWith('/products');

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
              LuxeLine
            </Link>

            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <ProductSearch 
                onResultClick={handleSearchResultClick}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button 
                  ref={userButtonRef}
                  className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onMouseEnter={handleUserHover}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User className="w-5 h-5" />
                </button>

                {isUserDropdownOpen && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setIsUserDropdownOpen(true)}
                    onMouseLeave={handleUserLeave}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            Welcome, {user?.username || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                        
                        <button
                          onClick={handleMyProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserCircle className="w-4 h-4" />
                          My Profile
                        </button>
                        
                        <button
                          onClick={handleSignOutClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSignInClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </button>
                        
                        <div className="px-4 py-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Sign in to access your profile and orders
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <div
                  ref={cartButtonRef}
                  className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"
                  onMouseEnter={handleCartHover}
                  onClick={handleViewCartClick}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAuthenticated && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount || 0}
                    </span>
                  )}
                </div>

                {isCartHoverOpen && (
                  <div 
                    ref={cartDropdownRef}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                    onMouseEnter={() => setIsCartHoverOpen(true)}
                    onMouseLeave={handleCartLeave}
                  >
                    {!isAuthenticated ? (
                      <div className="text-center">
                        <div className="mb-3">
                          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900 mb-1">Shopping cart is Empty</h3>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Welcome back!</p>
                          <p className="text-sm text-gray-600">
                            If you had items in your shopping cart, we saved them for you.{' '}
                            <span className="font-medium text-orange-600">SIGN IN</span> now to see them, 
                            or whenever you&apos;re ready to check out.
                          </p>
                        </div>

                        <button
                          onClick={handleCartSignInClick}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Sign In
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mb-3">
                          <ShoppingCart className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                          <h3 className="font-semibold text-gray-900 mb-1">Shopping Cart</h3>
                        </div>
                        
                        <div className="mb-4">
                          {cartItemCount > 0 ? (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                You have {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
                              </p>
                              <p className="text-sm text-gray-500">
                                Ready to checkout? View your cart to continue.
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Your cart is empty</p>
                              <p className="text-sm text-gray-500">
                                Start shopping to add items to your cart.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <button
                            onClick={handleViewCartClick}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                          >
                            View Cart
                          </button>
                          {cartItemCount === 0 && (
                            <Link
                              href="/products"
                              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                              onClick={() => setIsCartHoverOpen(false)}
                            >
                              Continue Shopping
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showMobileSearch && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <ProductSearch 
                onResultClick={handleSearchResultClick}
                className="w-full"
              />
            </div>
          )}

          <div className="border-t border-gray-100">
            <div className="flex items-center justify-center py-3">
              <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !currentCategory && isProductsPage
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      currentCategory === category && isProductsPage
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {category.replace(/'/g, '')}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              {!showMobileSearch && (
                <div className="mb-4">
                  <ProductSearch 
                    onResultClick={handleSearchResultClick}
                    className="w-full"
                  />
                </div>
              )}

              <div className="mb-4">
                <Link
                  href="/cart"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Shopping Cart</span>
                  </div>
                  {isAuthenticated && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount || 0}
                    </span>
                  )}
                </Link>
              </div>

              <div className="mb-4 space-y-2">
                <div className="text-sm font-semibold text-gray-600 mb-2">Account</div>
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        Welcome, {user?.username || 'User'}
                      </p>
                    </div>
                    <button
                      onClick={handleMyProfileClick}
                      className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOutClick}
                      className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSignInClick}
                    className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-600 mb-2">Categories</div>
                <button
                  onClick={() => {
                    handleCategoryClick(null);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-md text-sm ${
                    !currentCategory && isProductsPage
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryClick(category);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-md text-sm capitalize ${
                      currentCategory === category && isProductsPage
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.replace(/'/g, '')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={handleLoginSuccess}
        title="Welcome Back"
        subtitle="Sign in to access your account"
      />

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onLoginAgain={handleLogoutLoginAgain}
        onGoHome={handleLogoutGoHome}
        title="Sign Out"
        subtitle="Are you sure you want to sign out?"
      />
    </>
  );
}