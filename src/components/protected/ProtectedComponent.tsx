'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { selectUser, selectAuthLoading } from '@/lib/store/slices/userSlice';
import LoginDialog from '../auth/LoginDialog';
import { Loader2, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  showLoginDialog?: boolean;
  loginTitle?: string;
  loginSubtitle?: string;
}

export default function ProtectedRoute({
  children,
  fallback,
  requireAuth = true,
  showLoginDialog = true,
  loginTitle = "Authentication Required",
  loginSubtitle = "Please sign in to access this page"
}: ProtectedRouteProps) {
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const [showLogin, setShowLogin] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setHasCheckedAuth(true);
      
      if (requireAuth && !user && showLoginDialog) {
        setShowLogin(true);
      }
    }
  }, [authLoading, user, requireAuth, showLoginDialog]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  if (authLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    if (showLoginDialog) {
      return (
        <>
          {/* Fallback content or default protected page message */}
          {fallback || (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Authentication Required
                    </h1>
                    <p className="text-gray-600">
                      This page requires you to be signed in. Please log in to continue.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowLogin(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Sign In
                    </button>
                    <button
                      onClick={() => window.history.back()}
                      className="w-full text-gray-600 hover:text-gray-900 py-2 transition-colors"
                    >
                      ← Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <LoginDialog
            isOpen={showLogin}
            onClose={handleLoginClose}
            onLoginSuccess={handleLoginSuccess}
            title={loginTitle}
            subtitle={loginSubtitle}
          />
        </>
      );
    }

    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}