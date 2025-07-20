// app/blog/blog-listing-client.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, Clock, User, Calendar, Star, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl: string | null;
  category: {
    title: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
  };
  publishedAt: string;
  readTime: number;
  featured: boolean;
  premium: boolean;
}

interface Category {
  title: string;
  slug: string;
  postCount: number;
}

interface BlogListingData {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: Category[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    selectedCategory: string;
    searchTerm: string;
  };
}

interface BlogListingClientProps {
  data: BlogListingData;
}

export function BlogListingClient({ data }: BlogListingClientProps) {
  const [searchTerm, setSearchTerm] = useState(data.filters.searchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryFilter = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset to first page
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const BlogPostCard = ({ post, size = "medium" }: { post: BlogPost; size?: "large" | "medium" | "small" }) => (
    <motion.article className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" variants={fadeInUp} whileHover={{ y: -5 }}>
      <a href={`/blog/${post.slug}`} className="block">
        <div className={`relative overflow-hidden ${size === "large" ? "h-64" : size === "medium" ? "h-48" : "h-40"}`}>
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
              <span className="text-pink-500 text-lg font-medium">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {post.featured && (
              <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {post.premium && (
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-pink-500 px-3 py-1 rounded-full text-xs font-semibold">{post.category.title}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-pink-500 transition-colors line-clamp-2 ${size === "large" ? "text-xl" : "text-lg"}`}>{post.title}</h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" {...fadeInUp}>
            <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Discover insights, tips, and stories from our experts. Stay updated with the latest trends and knowledge.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-300"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts (only show if no filters applied) */}
      {!data.filters.selectedCategory && !data.filters.searchTerm && data.featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-4xl font-bold text-gray-900 text-center mb-12" {...fadeInUp}>
              Featured Articles
            </motion.h2>

            <motion.div className="grid md:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {data.featuredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} size="medium" />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Results Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">{data.filters.selectedCategory || data.filters.searchTerm ? `Filtered Results (${data.pagination.totalPosts})` : `All Articles (${data.pagination.totalPosts})`}</h2>
              {(data.filters.selectedCategory || data.filters.searchTerm) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.filters.selectedCategory && (
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Category: {data.categories.find((c) => c.slug === data.filters.selectedCategory)?.title}
                      <button onClick={() => handleCategoryFilter("")} className="ml-2 hover:text-pink-900">
                        ×
                      </button>
                    </span>
                  )}
                  {data.filters.searchTerm && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Search: {data.filters.searchTerm}
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          const params = new URLSearchParams(searchParams.toString());
                          params.delete("search");
                          router.push(`/blog?${params.toString()}`);
                        }}
                        className="ml-2 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors lg:hidden">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => handleCategoryFilter("")} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!data.filters.selectedCategory ? "bg-pink-100 text-pink-700 font-medium" : "hover:bg-gray-100"}`}>
                      All Categories ({data.pagination.totalPosts})
                    </button>
                  </li>
                  {data.categories.map((category) => (
                    <li key={category.slug}>
                      <button
                        onClick={() => handleCategoryFilter(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${data.filters.selectedCategory === category.slug ? "bg-pink-100 text-pink-700 font-medium" : "hover:bg-gray-100"}`}
                      >
                        {category.title} ({category.postCount})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {data.posts.length > 0 ? (
                <motion.div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                  {data.posts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">{data.filters.searchTerm || data.filters.selectedCategory ? "Try adjusting your search or filters" : "Check back later for new content"}</p>
                </div>
              )}

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <motion.div className="flex justify-center items-center space-x-2 mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <button
                    onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                    disabled={!data.pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                    const page = i + Math.max(1, data.pagination.currentPage - 2);
                    if (page > data.pagination.totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === data.pagination.currentPage ? "bg-pink-500 text-white" : "border border-gray-300 hover:bg-gray-50"}`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                    disabled={!data.pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
