// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle, ArrowLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          {/* Error Illustration */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-200 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text mb-4">Oops!</div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">We encountered an unexpected error. Don&apos;t worry, our team has been notified and is working to fix this issue.</p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left max-w-lg mx-auto">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details (Development Mode)</h3>
              <p className="text-sm text-red-700 font-mono break-words">{error.message}</p>
              {error.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button onClick={reset} className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>

            <Link href="/" className="inline-flex items-center px-6 py-3 bg-white text-red-500 font-semibold rounded-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-105">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 text-left">Refresh the page or try again in a few minutes</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 text-left">Check your internet connection</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 text-left">
                  If the problem persists, please{" "}
                  <Link href="/contact" className="text-pink-500 hover:text-pink-600 underline">
                    contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <button onClick={() => window.history.back()} className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go back to previous page
            </button>
          </div>

          {/* Footer Message */}
          <p className="text-sm text-gray-500 mt-8">
            Error occurred at {new Date().toLocaleString()}
            {error.digest && <span className="block mt-1">Reference ID: {error.digest.slice(0, 8)}...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
