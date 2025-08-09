/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BlogCard } from "./blog-card";

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

const Carousel: React.FC<{
  children: React.ReactNode;
  itemsPerView?: number;
  title: string;
  subtitle?: string;
  gap?: number;
}> = ({ children, itemsPerView = 3, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  // Responsive breakpoints
  const updateItemsToShow = useCallback(() => {
    const width = window.innerWidth;

    let newItemsToShow;
    if (width < 640) {
      newItemsToShow = 1; // mobile
    } else if (width < 768) {
      newItemsToShow = Math.min(2, itemsPerView); // small tablet
    } else if (width < 1024) {
      newItemsToShow = Math.min(2, itemsPerView); // tablet
    } else if (width < 1280) {
      newItemsToShow = Math.min(3, itemsPerView); // laptop
    } else {
      newItemsToShow = itemsPerView; // desktop
    }

    // Ensure we don't show more items than available
    newItemsToShow = Math.min(newItemsToShow, totalItems);

    setItemsToShow(newItemsToShow);

    // Reset index if it's out of bounds
    const maxIndex = Math.max(0, totalItems - newItemsToShow);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [itemsPerView, totalItems]);

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [updateItemsToShow]);

  // Calculate boundaries
  const maxIndex = Math.max(0, totalItems - itemsToShow);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const shouldShowNavigation = totalItems > itemsToShow;

  // Navigation functions
  const goToPrevious = () => {
    if (canGoPrevious && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToNext = () => {
    if (canGoNext && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canGoNext) {
      goToNext();
    }
    if (isRightSwipe && canGoPrevious) {
      goToPrevious();
    }
  };

  // Calculate item width percentage
  const itemWidthPercent = 100 / itemsToShow;
  const translateX = currentIndex * itemWidthPercent;

  return (
    <div className="w-full mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="hidden md:block text-sm md:text-base text-gray-600 max-w-2xl">{subtitle}</p>}
        </div>

        {/* Navigation Buttons */}
        {shouldShowNavigation && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious || isTransitioning}
              className={`
                p-2 md:p-3 rounded-full border transition-all duration-200
                ${canGoPrevious && !isTransitioning ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 hover:shadow-sm" : "border-gray-200 text-gray-300 cursor-not-allowed"}
              `}
              aria-label="Previous items"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext || isTransitioning}
              className={`
                p-2 md:p-3 rounded-full border transition-all duration-200
                ${canGoNext && !isTransitioning ? "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 hover:shadow-sm" : "border-gray-200 text-gray-300 cursor-not-allowed"}
              `}
              aria-label="Next items"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${translateX}%)`,
            }}
          >
            {childrenArray.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-3"
                style={{
                  width: `${itemWidthPercent}%`,
                }}
              >
                <div className="h-full">{child}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator (optional, for mobile) */}
        {shouldShowNavigation && itemsToShow === 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 300);
                  }
                }}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === currentIndex ? "bg-blue-600 w-4" : "bg-gray-300 hover:bg-gray-400"}
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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
          <Carousel title="What I'm Excited to Share" subtitle="The pieces I can't wait for you to read right now." itemsPerView={3}>
            {data.featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}

        {/* Favorite Posts Carousel */}
        {data.favoritePosts.length > 0 && (
          <Carousel title="Close to My Heart" subtitle="Stories and reflections that mean the most to me (and, I hope, to you too)." itemsPerView={4}>
            {data.favoritePosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </Carousel>
        )}

        {/* All Posts Grid */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Every Story So Far</h2>
              <p className="hidden md:block text-sm md:text-base text-gray-600 max-w-2xl">A little library of everything I&lsquo;ve written from everyday thoughts to deeper reflections.</p>
            </div>

            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium">
              <span>View All Blogs</span>
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
      </div>
    </section>
  );
};
