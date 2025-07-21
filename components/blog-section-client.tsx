/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, User, ArrowRight, Crown } from "lucide-react";

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

interface BlogData {
  featuredPosts: BlogPost[];
  recommendedPosts: BlogPost[];
  favoritePosts: BlogPost[];
  allPosts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPosts: number;
    postsPerPage: number;
    totalPages: number;
  };
}

interface BlogSectionClientProps {
  data: BlogData;
}

const BlogCard: React.FC<{ post: BlogPost; variant?: "default" | "featured" | "compact" }> = ({ post, variant = "default" }) => {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isFeatured ? "lg:col-span-2" : ""} ${isCompact ? "h-full" : ""}`}>
        <div className={`relative ${isCompact ? "aspect-[4/3]" : "aspect-[3/2]"} overflow-hidden`}>
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.imageAlt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-4xl">📝</div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm" style={{ backgroundColor: `${post.categoryColor}CC` }}>
              {post.categoryIcon && <img src={post.categoryIcon} alt="" className="inline w-3 h-3 mr-1" />}
              {post.category}
            </div>
          </div>

          {/* Premium Badge */}
          {post.premium && (
            <div className="absolute top-4 left-4 mt-8">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs flex items-center font-semibold">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            </div>
          )}

          {/* Read Time */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {post.readTime} min
          </div>
        </div>

        <div className={`p-${isCompact ? "4" : "6"}`}>
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${isFeatured ? "text-xl" : isCompact ? "text-base" : "text-lg"}`}>{post.title}</h3>

          <p className={`text-gray-600 mb-4 line-clamp-${isCompact ? "2" : "3"} ${isCompact ? "text-sm" : "text-base"}`}>{post.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.author.image ? (
                <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className={`font-medium text-gray-900 ${isCompact ? "text-sm" : "text-base"}`}>{post.author.name}</p>
                {post.author.jobTitle && !isCompact && <p className="text-xs text-gray-500">{post.author.jobTitle}</p>}
              </div>
            </div>

            <div className={`text-right ${isCompact ? "text-xs" : "text-sm"} text-gray-500`}>{post.date}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Carousel: React.FC<{
  children: React.ReactNode;
  itemsPerView?: number;
  title: string;
  subtitle?: string;
}> = ({ children, itemsPerView = 3, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const carouselRef = useRef<HTMLDivElement>(null);

  const childrenArray = React.Children.toArray(children);
  const maxIndex = Math.max(0, childrenArray.length - itemsToShow);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1280) setItemsToShow(itemsPerView);
      else if (window.innerWidth >= 1024) setItemsToShow(Math.min(3, itemsPerView));
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`p-3 rounded-full border transition-all ${canGoPrevious ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`p-3 rounded-full border transition-all ${canGoNext ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50" : "border-gray-200 text-gray-300 cursor-not-allowed"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)`,
            width: `${(childrenArray.length * 100) / itemsToShow}%`,
          }}
        >
          {childrenArray.map((child, index) => (
            <div key={index} className="px-3" style={{ width: `${100 / childrenArray.length}%` }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300"}`} />
        ))}
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className={`p-2 rounded-lg ${currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-lg font-medium ${page === currentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`p-2 rounded-lg ${currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export const BlogSectionClient: React.FC<BlogSectionClientProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(data.pagination.currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you'd update the URL and refetch data
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Posts Carousel */}
        {data.featuredPosts.length > 0 && (
          <Carousel title="Featured Stories" subtitle="Our editor's top picks this week" itemsPerView={2}>
            {data.featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </Carousel>
        )}

        {/* Recommended Posts Carousel */}
        {data.recommendedPosts.length > 0 && (
          <Carousel title="Recommended for You" subtitle="Curated content based on trending topics" itemsPerView={3}>
            {data.recommendedPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="default" />
            ))}
          </Carousel>
        )}

        {/* Favorite Posts Carousel */}
        {data.favoritePosts.length > 0 && (
          <Carousel title="Reader Favorites" subtitle="Most loved articles by our community" itemsPerView={4}>
            {data.favoritePosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}

        {/* All Posts Grid */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Articles</h2>
              <p className="text-gray-600">
                {data.pagination.totalPosts} articles • Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </p>
            </div>

            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium">
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.allPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={data.pagination.totalPages} onPageChange={handlePageChange} />}
        </div>

        {/* Newsletter CTA */}
        {/* <div className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Never Miss a Beauty Secret</h3>
          <p className="text-lg mb-8 opacity-90">Get the latest tips, tutorials, and product reviews delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30" />
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">Subscribe</button>
          </div>
        </div> */}
      </div>
    </section>
  );
};
