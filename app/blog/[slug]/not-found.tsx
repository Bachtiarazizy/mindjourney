// app/blog/[slug]/not-found.tsx
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Home } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Blog Not Found Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-16 h-16 text-pink-500" />
          </div>
          <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text mb-4">404</div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">Sorry, we couldn&apos;t find the blog post you&apos;re looking for. It might have been moved, deleted, or the URL might be incorrect.</p>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link href="/blog" className="w-full inline-flex items-center justify-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>

          <Link href="/" className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-pink-500 font-semibold rounded-lg border-2 border-pink-500 hover:bg-pink-50 transition-all duration-300 hover:scale-105">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Search className="w-5 h-5 mr-2 text-pink-500" />
            Try Searching Instead
          </h3>
          <p className="text-sm text-gray-600 mb-4">Use our search feature to find articles on topics you&apos;re interested in.</p>
          <Link href="/blog" className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium transition-colors">
            Browse all articles →
          </Link>
        </div>

        {/* Footer Message */}
        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please{" "}
          <Link href="/contact" className="text-pink-500 hover:text-pink-600 underline">
            let us know
          </Link>
        </p>
      </div>
    </div>
  );
}
