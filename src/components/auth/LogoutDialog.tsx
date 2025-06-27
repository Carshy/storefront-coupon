'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectAuthLoading, logoutUser } from '@/lib/store/slices/userSlice';
import { X, LogOut, Home, User, CheckCircle } from 'lucide-react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAgain: () => void;
  onGoHome: () => void;
  title?: string;
  subtitle?: string;
}

export default function LogoutDialog({ 
  isOpen, 
  onClose, 
  onLoginAgain,
  onGoHome,
  title = "Checkout Complete",
  subtitle = "You have been successfully logged out"
}: LogoutDialogProps) {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(selectAuthLoading);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      
      if (logoutUser.fulfilled.match(result)) {
        setLogoutSuccess(true);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCloseDialog = () => {
    setLogoutSuccess(false);
    onClose();
  };

  const handleLoginAgain = () => {
    setLogoutSuccess(false);
    onLoginAgain();
  };

  const handleGoHome = () => {
    setLogoutSuccess(false);
    onGoHome();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${logoutSuccess ? 'bg-green-100' : 'bg-orange-100'}`}>
              {logoutSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <LogOut className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {logoutSuccess ? 'Logged Out Successfully' : title}
              </h2>
              <p className="text-sm text-gray-600">
                {logoutSuccess ? subtitle : 'Click below to proceed with checkout and logout'}
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

        <div className="p-6">
          {!logoutSuccess ? (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-2">Ready to checkout?</p>
                  <p>
                    Proceeding will complete your order simulation and log you out of your account. 
                    You can choose to log back in or return to the home page afterwards.
                  </p>
                </div>
              </div>

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
                  onClick={handleLogout}
                  disabled={authLoading}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Proceed & Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">Checkout Complete!</p>
                  <p>
                    Your order has been processed and you have been successfully logged out. 
                    Thank you for shopping with us!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleGoHome}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
                <button
                  onClick={handleLoginAgain}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Login Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            {logoutSuccess 
              ? "You can continue shopping or log back in anytime"
              : "Your cart items will be saved for your next visit"
            }
          </p>
        </div>
      </div>
    </div>
  );
}