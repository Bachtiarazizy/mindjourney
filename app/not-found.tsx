// app/not-found.tsx
import Link from "next/link";
import { ArrowLeft, Home, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                <FileQuestion className="w-16 h-16 text-pink-500" />
              </div>
            </div>
            <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text mb-4">404</div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>

            <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-white text-pink-500 font-semibold rounded-lg border-2 border-pink-500 hover:bg-pink-50 transition-all duration-300 hover:scale-105">
              <Search className="w-5 h-5 mr-2" />
              Browse Blog
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <nav className="space-y-3">
              <Link href="/" className="flex items-center justify-between text-gray-600 hover:text-pink-500 transition-colors py-2 border-b border-gray-100 last:border-b-0">
                <span>Home</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
              <Link href="/blog" className="flex items-center justify-between text-gray-600 hover:text-pink-500 transition-colors py-2 border-b border-gray-100 last:border-b-0">
                <span>Blog</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
              <Link href="/about" className="flex items-center justify-between text-gray-600 hover:text-pink-500 transition-colors py-2 border-b border-gray-100 last:border-b-0">
                <span>About</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
              <Link href="/contact" className="flex items-center justify-between text-gray-600 hover:text-pink-500 transition-colors py-2">
                <span>Contact</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </nav>
          </div>

          {/* Footer Message */}
          <p className="text-sm text-gray-500 mt-8">
            If you think this is an error, please{" "}
            <Link href="/contact" className="text-pink-500 hover:text-pink-600 underline">
              contact us
            </Link>{" "}
            and let us know.
          </p>
        </div>
      </div>
    </div>
  );
}
