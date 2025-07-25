// components/blog-listing-client.tsx
"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, Clock, User, Calendar, Star, Lock, Tag, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// Updated interfaces to match the blog page data structure
interface Author {
  name: string;
  jobTitle: string;
  shortBio: string;
  image: string | null;
  slug: string;
}

interface BlogPost {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: string | null;
  title: string;
  description: string;
  author: Author;
  date: string;
  imageUrl: string | null;
  imageAlt: string;
  slug: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  recommended: boolean;
  favorite: boolean;
  premium: boolean;
}

interface Category {
  title: string;
  slug: string;
  postCount: number;
  color: string;
  icon: string | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  postsPerPage: number;
}

interface Filters {
  selectedCategory: string;
  searchTerm: string;
  selectedTag: string;
  selectedAuthor: string;
}

interface AvailableFilters {
  tags: string[];
  authors: { name: string; slug: string }[];
}

interface BlogListingData {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: Category[];
  pagination: Pagination;
  filters: Filters;
  availableFilters: AvailableFilters;
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

  // Helper function to update URL parameters
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Always reset to first page when filters change (except for page changes)
      if (!updates.page) {
        params.delete("page");
      }

      router.push(`/blog?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm });
  };

  const handleCategoryFilter = (categorySlug: string) => {
    updateUrlParams({ category: categorySlug || null });
  };

  const handleTagFilter = (tag: string) => {
    updateUrlParams({ tag: tag || null });
  };

  const handleAuthorFilter = (authorSlug: string) => {
    updateUrlParams({ author: authorSlug || null });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page: page.toString() });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    updateUrlParams({
      search: null,
      category: null,
      tag: null,
      author: null,
    });
  };

  const removeFilter = (filterType: string) => {
    const updates: Record<string, string | null> = {};

    switch (filterType) {
      case "search":
        setSearchTerm("");
        updates.search = null;
        break;
      case "category":
        updates.category = null;
        break;
      case "tag":
        updates.tag = null;
        break;
      case "author":
        updates.author = null;
        break;
    }

    updateUrlParams(updates);
  };

  const BlogPostCard = ({ post, size = "medium" }: { post: BlogPost; size?: "large" | "medium" | "small" }) => (
    <motion.article className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100" variants={fadeInUp} whileHover={{ y: -5 }}>
      <a href={`/blog/${post.slug}`} className="block">
        <div className={`relative overflow-hidden ${size === "large" ? "h-64" : size === "medium" ? "h-48" : "h-40"}`}>
          {post.imageUrl ? (
            <Image src={post.imageUrl} alt={post.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ backgroundColor: `${post.categoryColor}20` }}>
              <span className="text-gray-500 text-lg font-medium">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {post.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {post.premium && (
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </span>
            )}
            {post.recommended && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">Recommended</span>}
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center" style={{ color: post.categoryColor }}>
              {post.categoryIcon && <Image src={post.categoryIcon} alt="" width={16} height={16} className="mr-1" />}
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:transition-colors line-clamp-2 ${size === "large" ? "text-xl" : "text-lg"}`}>{post.title}</h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: `${post.categoryColor}15`, color: post.categoryColor }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTagFilter(tag);
                  }}
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {post.author.image ? <Image src={post.author.image} alt={post.author.name} width={20} height={20} className="rounded-full" /> : <User className="w-4 h-4" />}
                <span
                  className="hover:text-gray-700 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAuthorFilter(post.author.slug);
                  }}
                >
                  {post.author.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );

  const hasActiveFilters = data.filters.selectedCategory || data.filters.searchTerm || data.filters.selectedTag || data.filters.selectedAuthor;
  const shouldShowFeatured = !hasActiveFilters && data.pagination.currentPage === 1 && data.featuredPosts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4460a6] via-[#36539b] to-[#527ff0] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" {...fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">Our Blog</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Discover insights, tips, and stories from our experts. Stay updated with the latest trends and knowledge.</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-14 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors shadow-md">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {shouldShowFeatured && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-4xl font-bold text-gray-900 text-center mb-12" {...fadeInUp}>
              Featured Articles
            </motion.h2>

            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {data.featuredPosts.slice(0, 6).map((post) => (
                <BlogPostCard key={post.id} post={post} size="medium" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{hasActiveFilters ? `Filtered Results (${data.pagination.totalPosts})` : `All Articles (${data.pagination.totalPosts})`}</h2>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.filters.selectedCategory && (
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Category: {data.categories.find((c) => c.slug === data.filters.selectedCategory)?.title}
                      <button onClick={() => removeFilter("category")} className="ml-2 hover:text-pink-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {data.filters.searchTerm && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Search: &quot;{data.filters.searchTerm}&quot;
                      <button onClick={() => removeFilter("search")} className="ml-2 hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {data.filters.selectedTag && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Tag: #{data.filters.selectedTag}
                      <button onClick={() => removeFilter("tag")} className="ml-2 hover:text-green-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {data.filters.selectedAuthor && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                      Author: {data.availableFilters.authors.find((a) => a.slug === data.filters.selectedAuthor)?.name}
                      <button onClick={() => removeFilter("author")} className="ml-2 hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button onClick={clearAllFilters} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors lg:hidden">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleCategoryFilter("")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${!data.filters.selectedCategory ? "bg-pink-100 text-pink-700 font-medium" : "hover:bg-gray-100"}`}
                      >
                        <span>All Categories</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{data.categories.reduce((sum, cat) => sum + cat.postCount, 0)}</span>
                      </button>
                    </li>
                    {data.categories.map((category) => (
                      <li key={category.slug}>
                        <button
                          onClick={() => handleCategoryFilter(category.slug)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                            data.filters.selectedCategory === category.slug ? "bg-pink-100 text-pink-700 font-medium" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="flex items-center">
                            {category.icon && <Image src={category.icon} alt="" width={16} height={16} className="mr-2" />}
                            {category.title}
                          </span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{category.postCount}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Tags */}
                {data.availableFilters.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.availableFilters.tags.slice(0, 10).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagFilter(tag)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${data.filters.selectedTag === tag ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors */}
                {data.availableFilters.authors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Authors
                    </h3>
                    <ul className="space-y-2">
                      {data.availableFilters.authors.slice(0, 8).map((author) => (
                        <li key={author.slug}>
                          <button
                            onClick={() => handleAuthorFilter(author.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${data.filters.selectedAuthor === author.slug ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100"}`}
                          >
                            {author.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {data.posts.length > 0 ? (
                <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                  {data.posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-6">📝</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">No articles found</h3>
                  <p className="text-gray-600 mb-6">{hasActiveFilters ? "Try adjusting your search or filters to find what you're looking for." : "Check back later for new content."}</p>
                  {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Enhanced Pagination */}
              {data.pagination.totalPages > 1 && (
                <motion.div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="text-sm text-gray-600">
                    Showing {(data.pagination.currentPage - 1) * data.pagination.postsPerPage + 1} to {Math.min(data.pagination.currentPage * data.pagination.postsPerPage, data.pagination.totalPosts)} of {data.pagination.totalPosts} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                      disabled={!data.pagination.hasPrevPage}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: Math.min(7, data.pagination.totalPages) }, (_, i) => {
                      let page;
                      if (data.pagination.totalPages <= 7) {
                        page = i + 1;
                      } else {
                        const current = data.pagination.currentPage;
                        if (current <= 4) {
                          page = i + 1;
                        } else if (current >= data.pagination.totalPages - 3) {
                          page = data.pagination.totalPages - 6 + i;
                        } else {
                          page = current - 3 + i;
                        }
                      }

                      if (page < 1 || page > data.pagination.totalPages) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === data.pagination.currentPage ? "bg-pink-500 text-white shadow-md" : "border border-gray-300 hover:bg-gray-50"}`}
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
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
